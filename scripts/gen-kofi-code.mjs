#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Ko-fi 激活码离线签发工具
 * 用法:
 *   # 生成 1 个月卡激活码
 *   node scripts/gen-kofi-code.mjs monthly
 *
 *   # 生成 5 个终身卡激活码
 *   node scripts/gen-kofi-code.mjs one_time --count 5
 *
 *   # 使用自定义 secret（不写死，避免提交仓库；优先从 KOFI_ACTIVATION_HMAC_SECRET 环境变量取）
 *   KOFI_ACTIVATION_HMAC_SECRET=<32+字节密钥> node scripts/gen-kofi-code.mjs commercial --count 3
 *
 * Tier 合法值：monthly | one_time | commercial
 */

import { randomBytes, webcrypto } from 'node:crypto';

const TIER_CODES = {
  monthly: 'MN',
  one_time: 'LT',
  lifetime: 'LT',
  commercial: 'TM',
};

function parseArgs(argv) {
  const rest = [];
  const flags = { count: 1 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--count' || a === '-n') {
      flags.count = parseInt(argv[++i] || '1', 10);
      if (Number.isNaN(flags.count) || flags.count < 1) flags.count = 1;
    } else {
      rest.push(a);
    }
  }
  return { flags, rest };
}

function randomId(len) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = randomBytes(len);
  let out = '';
  for (let i = 0; i < len; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

async function hmacSha256(secret, data) {
  const key = await webcrypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = new Uint8Array(
    await webcrypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  );
  return Array.from(sig).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function genOne(tier, secret) {
  const tierCode = TIER_CODES[tier];
  if (!tierCode) throw new Error('invalid tier, expected: monthly | one_time | commercial');
  const id = randomId(6);
  const payload = `KOFI-${tierCode}-${id}`;
  const mac = (await hmacSha256(secret, payload)).slice(0, 8).toUpperCase();
  return `${payload}-${mac}`;
}

async function main() {
  const { flags, rest } = parseArgs(process.argv);
  const tier = rest[0] || 'monthly';
  const secret = process.env.KOFI_ACTIVATION_HMAC_SECRET;
  if (!secret || secret.length < 16) {
    console.error(
      '[ERROR] 请先设置环境变量 KOFI_ACTIVATION_HMAC_SECRET (至少 16 字节，与 Pages Functions 的 KOFI_ACTIVATION_HMAC_SECRET Secret 完全一致)。'
    );
    process.exit(1);
  }
  const codes = [];
  for (let i = 0; i < flags.count; i++) codes.push(await genOne(tier, secret));
  for (const c of codes) console.log(c);
}
main().catch((e) => {
  console.error('[ERROR]', e?.message || String(e));
  process.exit(2);
});
