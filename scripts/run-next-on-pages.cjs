/* eslint-disable */
/**
 * Cross-platform wrapper for @cloudflare/next-on-pages
 * Fixes Windows / PowerShell incompatibilities:
 *   1. shellac hardcodes `spawn("bash")` → picks WSL bash (C:\Windows\system32\bash.exe)
 *      which runs in a Linux container and cannot see Windows-installed pnpm/npm.
 *      Solution: prepend Git Bash (MSYS2) dir to PATH so spawn("bash") resolves
 *      to <Git>\bin\bash.exe (works with native Windows file paths / tools).
 *   2. pnpm/npm .cmd shims not callable from Git Bash → create temp bash wrappers.
 *   3. Also sets MSYS_NO_PATHCONV=1 to prevent MSYS from mangling Windows paths.
 *
 * Usage:  node scripts/run-next-on-pages.cjs [next-on-pages args...]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const Module = require('module');

const ORIGINAL_ENV = { ...process.env };

function log(msg) {
  const ts = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  process.stderr.write(`[next-on-pages-win ${ts}] ${msg}\n`);
}

function findGitBashDirs() {
  const candidates = [];
  const programFiles = [process.env['ProgramW6432'], process.env['ProgramFiles'], process.env['ProgramFiles(x86)']].filter(Boolean);
  for (const pf of programFiles) {
    candidates.push(path.join(pf, 'Git', 'bin'));
    candidates.push(path.join(pf, 'Git', 'usr', 'bin'));
  }
  if (process.env.LOCALAPPDATA) {
    candidates.push(path.join(process.env.LOCALAPPDATA, 'Programs', 'Git', 'bin'));
    candidates.push(path.join(process.env.LOCALAPPDATA, 'Programs', 'Git', 'usr', 'bin'));
  }
  if (process.env['ProgramData']) {
    candidates.push(path.join(process.env['ProgramData'], 'chocolatey', 'lib', 'git', 'tools', 'bin'));
  }
  try {
    const gitExe = require('child_process').execSync('where.exe git', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split(/\r?\n/)[0].trim();
    if (gitExe && fs.existsSync(gitExe)) {
      candidates.push(path.resolve(path.dirname(gitExe), '..', 'bin'));
    }
  } catch (_) {}
  return candidates.filter((p) => p && fs.existsSync(path.join(p, 'bash.exe')));
}

function findNpmGlobalBin() {
  try {
    const out = require('child_process').execSync('npm.cmd config get prefix', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return path.join(out, 'bin');
  } catch (_) {
    const npmRoaming = path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'npm');
    const exists = fs.existsSync(path.join(npmRoaming, 'pnpm.cmd')) || fs.existsSync(path.join(npmRoaming, 'npm.cmd'));
    return exists ? npmRoaming : null;
  }
}

function findWinExecutable(cmd) {
  const extPriority = ['.exe', '.cmd', '.bat', '.com', '.ps1'];
  for (const ext of extPriority) {
    try {
      const where = require('child_process').execSync(`where.exe ${cmd}${ext}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split(/\r?\n/).map(s => s.trim()).filter(Boolean)[0];
      if (where && fs.existsSync(where)) return where;
    } catch (_) {}
  }
  try {
    const where = require('child_process').execSync(`where.exe ${cmd}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split(/\r?\n/).map(s => s.trim()).filter(Boolean)[0];
    if (where) {
      // 如果是无扩展名的，不返回，避免不是 Win32 PE
      if (/\.(exe|cmd|bat|com|ps1)$/i.test(where) && fs.existsSync(where)) return where;
    }
  } catch (_) {}
  return null;
}

function ensureTempBashShims(tmpDir) {
  const shims = [];
  const pmCommands = ['pnpm', 'npm', 'npx', 'yarn', 'bun', 'node', 'vercel'];
  const shimTemplateExe = path.join(__dirname, '_shim.exe');
  const hasShimTemplate = fs.existsSync(shimTemplateExe);

  for (const cmd of pmCommands) {
    let winPath = findWinExecutable(cmd);
    if (!winPath) {
      const localBin = path.join(process.cwd(), 'node_modules', '.bin', `${cmd}.cmd`);
      if (fs.existsSync(localBin)) winPath = localBin;
    }
    if (!winPath) continue;
    const winPosix = winPath.replace(/\\/g, '/');
    const scriptContent =
      cmd === 'node'
        ? `#!/bin/bash\nexec "${winPosix}" "$@"\n`
        : `#!/bin/bash\nSCRIPT="${winPosix}"\nif [[ "$SCRIPT" == *.cmd || "$SCRIPT" == *.bat ]]; then\n  exec cmd //c "$(cygpath -w "$SCRIPT" 2>/dev/null || echo "$SCRIPT" | sed 's#^/\\([A-Za-z]\\)/#\\1:/#')" "$@"\nelse\n  exec "$SCRIPT" "$@"\nfi\n`;
    const shimBash = path.join(tmpDir, cmd);
    fs.writeFileSync(shimBash, scriptContent, 'utf8');
    try { fs.chmodSync(shimBash, 0o755); } catch (_) {}
    const shimCmd = path.join(tmpDir, `${cmd}.cmd`);
    const cmdContent = `@ECHO OFF\r\n"${winPath}" %*\r\n`;
    fs.writeFileSync(shimCmd, cmdContent, 'utf8');
    if (hasShimTemplate) {
      const shimExe = path.join(tmpDir, `${cmd}.exe`);
      fs.copyFileSync(shimTemplateExe, shimExe);
      const targetCfg = path.join(tmpDir, `${cmd}.target`);
      fs.writeFileSync(targetCfg, winPath + '\r\n', 'utf8');
    }
    shims.push(`${cmd} -> ${winPath}`);
  }
  return shims;
}

function patchSpawnForBash() {
  const isWinLocal = process.platform === 'win32';

  function whichOnPath(cmd, envPath, pathExt) {
    if (!cmd || typeof cmd !== 'string') return null;
    if (path.isAbsolute(cmd)) return fs.existsSync(cmd) ? cmd : null;
    if (cmd.includes('/') || cmd.includes('\\')) return fs.existsSync(cmd) ? cmd : null;
    const hasExt = /\.(exe|com|bat|cmd|ps1|msi)$/i.test(cmd);
    const exts = isWinLocal
      ? (hasExt ? [''] : (pathExt || process.env.PATHEXT || '.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC;.PSC1').split(';').filter(Boolean).map(e => e.toLowerCase()))
      : [''];
    const paths = String(envPath || process.env.PATH || '').split(path.delimiter).filter(Boolean);
    for (const p of paths) {
      for (const ext of exts) {
        const candidate = path.join(p, cmd + ext);
        try { if (fs.existsSync(candidate)) return candidate; } catch (_) {}
      }
    }
    return null;
  }

  function resolveCommand(cmd, envObj) {
    if (isWinLocal) {
      const low = String(cmd).toLowerCase();
      if (low === 'bash' || low === 'sh') {
        const bash = process.env.__CORRECT_BASH;
        if (bash && fs.existsSync(bash)) return bash;
      }
    }
    if (isWinLocal && typeof cmd === 'string') {
      const resolved = whichOnPath(cmd, envObj && envObj.PATH, envObj && envObj.PATHEXT);
      if (resolved) return resolved;
    }
    return cmd;
  }

  function normalizeSpawnArgs(command, args, options) {
    if (typeof args === 'object' && !Array.isArray(args)) {
      options = args;
      args = undefined;
    }
    const opts = Object.assign({}, options || {});
    const mergedEnv = (!opts.env || typeof opts.env !== 'object')
      ? process.env
      : Object.assign({}, process.env, opts.env);
    opts.env = mergedEnv;
    return [resolveCommand(command, mergedEnv), args, opts];
  }

  const Module = require('module');
  const realCP = require('child_process');
  const origSpawn = realCP.spawn;
  const origSpawnSync = realCP.spawnSync;
  const origExecFile = realCP.execFile;
  const origExecFileSync = realCP.execFileSync;
  const origFork = realCP.fork;

  function patchedSpawn(command, args, options) {
    const [c, a, o] = normalizeSpawnArgs(command, args, options);
    return origSpawn.call(realCP, c, a, o);
  }
  function patchedSpawnSync(command, args, options) {
    const [c, a, o] = normalizeSpawnArgs(command, args, options);
    return origSpawnSync.call(realCP, c, a, o);
  }
  function patchedExecFile(file, args, options, callback) {
    if (typeof args === 'function') { callback = args; args = undefined; options = undefined; }
    if (typeof options === 'function') { callback = options; options = undefined; }
    if (typeof args === 'object' && !Array.isArray(args)) { options = args; args = undefined; }
    const [c, a, o] = normalizeSpawnArgs(file, args, options);
    return origExecFile.call(realCP, c, a, o, callback);
  }
  function patchedExecFileSync(file, args, options) {
    if (typeof args === 'object' && !Array.isArray(args)) { options = args; args = undefined; }
    const [c, a, o] = normalizeSpawnArgs(file, args, options);
    return origExecFileSync.call(realCP, c, a, o);
  }

  function wrapCPModule(modExports) {
    if (!modExports || typeof modExports !== 'object') return modExports;
    const wrapped = Object.create(Object.getPrototypeOf(modExports));
    const keys = Object.keys(modExports);
    for (const k of keys) {
      try { Object.defineProperty(wrapped, k, Object.getOwnPropertyDescriptor(modExports, k)); } catch(_) {}
    }
    Object.defineProperties(wrapped, {
      spawn: { value: patchedSpawn, enumerable: true, configurable: true, writable: true },
      spawnSync: { value: patchedSpawnSync, enumerable: true, configurable: true, writable: true },
      execFile: { value: patchedExecFile, enumerable: true, configurable: true, writable: true },
      execFileSync: { value: patchedExecFileSync, enumerable: true, configurable: true, writable: true },
    });
    if (modExports.default) wrapped.default = modExports.default === modExports ? wrapped : modExports.default;
    return wrapped;
  }

  realCP.spawn = patchedSpawn;
  realCP.spawnSync = patchedSpawnSync;
  realCP.execFile = patchedExecFile;
  realCP.execFileSync = patchedExecFileSync;
  if (typeof realCP.fork === 'function') {
    realCP.fork = function patchedFork(...args) { return origFork.apply(this, args); };
  }

  const origLoad = Module._load;
  const cacheKey1 = 'child_process';
  const cacheKey2 = 'node:child_process';
  const wrappedExport = wrapCPModule(realCP);
  const wrappedExportMarker = Symbol.for('nop-win-wrapped-cp');
  wrappedExport[wrappedExportMarker] = true;
  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === cacheKey1 || request === cacheKey2) {
      const mod = origLoad.call(this, request, parent, isMain);
      if (mod && typeof mod === 'object' && !mod[wrappedExportMarker]) {
        if (typeof mod.spawn === 'function') mod.spawn = patchedSpawn;
        if (typeof mod.spawnSync === 'function') mod.spawnSync = patchedSpawnSync;
        if (typeof mod.execFile === 'function') mod.execFile = patchedExecFile;
        if (typeof mod.execFileSync === 'function') mod.execFileSync = patchedExecFileSync;
      }
      return mod;
    }
    return origLoad.call(this, request, parent, isMain);
  };

  if (process.setSourceMapsEnabled) {
    try { process.setSourceMapsEnabled(false); } catch (_) {}
  }
  log(`child_process interceptor installed: bash/sh + auto .cmd PATH lookup (Module._load hook)`);
}

(function main() {
  const isWin = process.platform === 'win32';
  if (isWin) {
    log('Windows detected — applying Git Bash / package-manager shims fix');

    const bashDirs = findGitBashDirs();
    if (bashDirs.length === 0) {
      log('⚠️  Git Bash not found! Install Git for Windows (https://git-scm.com)');
      process.exit(2);
    }
    const bashBinDir = bashDirs[0];
    const bashExePath = path.join(bashBinDir, 'bash.exe');
    log(`Using Git Bash: ${bashExePath}`);

    process.env.__CORRECT_BASH = bashExePath;
    process.env.MSYS_NO_PATHCONV = '1';
    process.env.MSYS2_ARG_CONV_EXCL = '*';
    process.env.CHERE_INVOKING = '1';
    process.env.CI = '1';
    process.env.GITHUB_ACTIONS = process.env.GITHUB_ACTIONS || 'true';

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nop-shims-'));
    const pnpmCache = path.join(tmpDir, 'pnpm-cache');
    const pnpmStore = path.join(tmpDir, 'pnpm-store');
    const pnpmHome = path.join(tmpDir, 'pnpm-home');
    const pnpmDlx = path.join(tmpDir, 'pnpm-dlx');
    fs.mkdirSync(pnpmCache, { recursive: true });
    fs.mkdirSync(pnpmStore, { recursive: true });
    fs.mkdirSync(pnpmHome, { recursive: true });
    fs.mkdirSync(pnpmDlx, { recursive: true });
    process.env.PNPM_HOME = pnpmHome;
    process.env.PNPM_STORE_DIR = pnpmStore;
    process.env.PNPM_CACHE_DIR = pnpmCache;
    process.env.XDG_CACHE_HOME = pnpmCache;
    process.env.PNPM_DLX_DIR = pnpmDlx;
    process.env.PNPM_PREFER_SYMLINKED_EXECUTABLES = 'false';
    process.env.PNPM_NODE_LINKER = 'hoisted';
    process.env.PNPM_SIDE_EFFECTS_CACHE = 'false';
    process.env.PNPM_ENABLE_ENGINES_CHECK = 'false';

    const shimsInstalled = ensureTempBashShims(tmpDir);
    log(`Temp shim dir: ${tmpDir} (${shimsInstalled.length} shims: ${shimsInstalled.map(s => s.split(' -> ')[0]).join(', ')})`);

    const npmGlobal = findNpmGlobalBin();
    const localBin = path.join(process.cwd(), 'node_modules', '.bin');

    const prepend = [tmpDir, bashBinDir];
    if (fs.existsSync(localBin)) prepend.push(localBin);
    if (npmGlobal && fs.existsSync(npmGlobal)) prepend.push(npmGlobal);
    process.env.PATH = prepend.join(';') + ';' + process.env.PATH;

    patchSpawnForBash();
  } else {
    log(`Non-Windows platform (${process.platform}) — skip Windows-specific shims`);
  }

  const localBin = path.join(process.cwd(), 'node_modules', '.bin');
  const winShim = path.join(localBin, 'next-on-pages.cmd');
  const unixShim = path.join(localBin, 'next-on-pages');
  let cliEntry = null;
  let injectedNodePath = null;
  if (fs.existsSync(winShim)) {
    const shimContent = fs.readFileSync(winShim, 'utf8');
    const npMatch = shimContent.match(/NODE_PATH=([^\r\n"%]+)/);
    if (npMatch) injectedNodePath = npMatch[1];
    cliEntry = path.resolve(localBin, '..', '@cloudflare', 'next-on-pages', 'bin', 'index.js');
    if (!fs.existsSync(cliEntry)) cliEntry = null;
  }
  if (!cliEntry && fs.existsSync(unixShim)) {
    try {
      cliEntry = require.resolve('@cloudflare/next-on-pages/bin/index.js', { paths: [localBin] });
    } catch (_) {
      cliEntry = path.resolve(localBin, '..', '@cloudflare', 'next-on-pages', 'bin', 'index.js');
      if (!fs.existsSync(cliEntry)) cliEntry = null;
    }
  }
  if (!cliEntry || !fs.existsSync(cliEntry)) {
    log('⚠️  Could not locate next-on-pages CLI script. Run: pnpm install');
    process.exit(3);
  }
  if (injectedNodePath) {
    process.env.NODE_PATH = injectedNodePath + (process.env.NODE_PATH ? ';' + process.env.NODE_PATH : '');
    require('module').Module._initPaths();
  }
  log(`Loading next-on-pages CLI: ${cliEntry}`);
  process.argv = [process.argv[0], cliEntry, ...process.argv.slice(2)];
  Module.runMain();
})();
