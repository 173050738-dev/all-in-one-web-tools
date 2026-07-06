using System;
using System.Diagnostics;
using System.IO;
using System.Text;

public class Shim {
  private static string QuoteArg(string a) {
    if (string.IsNullOrEmpty(a) || a.IndexOf(' ') >= 0 || a.IndexOf('\t') >= 0
        || a.IndexOf('"') >= 0 || a.IndexOf('&') >= 0 || a.IndexOf('|') >= 0
        || a.IndexOf('(') >= 0 || a.IndexOf(')') >= 0 || a.IndexOf('^') >= 0) {
      StringBuilder sb = new StringBuilder();
      sb.Append('"');
      int backslash = 0;
      foreach (char ch in a) {
        if (ch == '\\') { backslash++; continue; }
        if (ch == '"') {
          sb.Append('\\', backslash * 2 + 1);
          sb.Append('"');
        } else {
          sb.Append('\\', backslash);
          sb.Append(ch);
        }
        backslash = 0;
      }
      sb.Append('\\', backslash * 2);
      sb.Append('"');
      return sb.ToString();
    }
    return a;
  }

  public static int Main(string[] args) {
    try {
      string myExe = Process.GetCurrentProcess().MainModule.FileName;
      string dir = Path.GetDirectoryName(myExe);
      string baseName = Path.GetFileNameWithoutExtension(myExe);
      string targetCmd = Path.Combine(dir, baseName + ".cmd");
      string targetCfg = Path.Combine(dir, baseName + ".target");
      string realTarget = null;
      if (File.Exists(targetCfg)) {
        foreach (string line in File.ReadAllLines(targetCfg)) {
          string s = line.Trim();
          if (s.Length == 0 || s.StartsWith("#")) continue;
          realTarget = s;
          break;
        }
      }
      if (realTarget == null) realTarget = targetCmd;
      if (!File.Exists(realTarget)) {
        Console.Error.WriteLine("[nop-shim] Target not found: " + realTarget);
        return 9009;
      }
      bool isBatch = realTarget.EndsWith(".cmd", StringComparison.OrdinalIgnoreCase)
                  || realTarget.EndsWith(".bat", StringComparison.OrdinalIgnoreCase);
      ProcessStartInfo psi = new ProcessStartInfo();
      psi.UseShellExecute = false;
      if (isBatch) {
        string comSpec = Environment.GetEnvironmentVariable("ComSpec");
        if (string.IsNullOrEmpty(comSpec) || !File.Exists(comSpec)) comSpec = "cmd.exe";
        psi.FileName = comSpec;
        StringBuilder sb = new StringBuilder();
        sb.Append("/D /S /C \"").Append("\"").Append(realTarget).Append("\"");
        foreach (string a in args) { sb.Append(" ").Append(QuoteArg(a)); }
        sb.Append("\"");
        psi.Arguments = sb.ToString();
      } else {
        psi.FileName = realTarget;
        StringBuilder sb = new StringBuilder();
        bool first = true;
        foreach (string a in args) {
          if (!first) sb.Append(' ');
          sb.Append(QuoteArg(a));
          first = false;
        }
        psi.Arguments = sb.ToString();
      }
      using (Process p = Process.Start(psi)) {
        p.WaitForExit();
        try { return p.ExitCode; } catch { return 0; }
      }
    } catch (Exception ex) {
      Console.Error.WriteLine("[nop-shim] " + ex.Message);
      return -1;
    }
  }
}
