"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileEdit, AlertCircle, FileArchive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileUploader from "@/components/FileUploader";
import { useQuotaGuard } from "@/hooks/useQuotaGuard";
import { useStore } from "@/store/useStore";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type RenameMode = "prefix" | "suffix" | "regex" | "drawing";

export default function RenamePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<RenameMode>("prefix");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [regexPattern, setRegexPattern] = useState("");
  const [regexReplace, setRegexReplace] = useState("");
  const [drawingProject, setDrawingProject] = useState("");
  const [drawingStartNum, setDrawingStartNum] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ zipUrl: string; previews: { old: string; new: string }[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { checkQuota, consumeQuota } = useQuotaGuard();
  const { user } = useStore();

  const maxFiles = user?.max_files_per_request || 2;

  const handleFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles));
    setResult(null);
    setError(null);
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const generateNewName = (original: string, index: number): string => {
    const base = original.replace(/\.pdf$/i, "");
    const ext = ".pdf";

    switch (mode) {
      case "prefix":
        return `${prefix}${base}${ext}`;
      case "suffix":
        return `${base}${suffix}${ext}`;
      case "regex": {
        try {
          const re = new RegExp(regexPattern, "g");
          return `${base.replace(re, regexReplace)}${ext}`;
        } catch {
          return `${base}_error${ext}`;
        }
      }
      case "drawing": {
        const num = String(drawingStartNum + index).padStart(3, "0");
        return `${drawingProject}_DWG-${num}${ext}`;
      }
      default:
        return original;
    }
  };

  const handleRename = async () => {
    if (files.length === 0) return;
    setError(null);

    const quota = await checkQuota(files.length);
    if (!quota.allowed) {
      setError(quota.reason || "Insufficient quota");
      return;
    }

    setProcessing(true);
    try {
      const zip = new JSZip();
      const previews: { old: string; new: string }[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const newName = generateNewName(file.name, i);
        previews.push({ old: file.name, new: newName });

        // 使用 pdf-lib Re-save to update internal metadata（可选）
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        // Set document title and other metadata here
        pdf.setTitle(newName.replace(/\.pdf$/i, ""));
        const saved = await pdf.save();
        zip.file(newName, saved);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipBlob);
      setResult({ zipUrl, previews });

      await consumeQuota("rename", files.length);
    } catch (e) {
      setError("Rename failed: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Batch Rename PDF</h1>
        <p className="mt-2 text-muted-foreground">
          Supports Prefix, Suffix, Regex Replace, and Drawing Number rules for batch renaming
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileEdit className="h-5 w-5 text-primary" />
            Upload & Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUploader
            files={files}
            onFilesSelected={handleFiles}
            onRemoveFile={handleRemove}
            multiple
            maxFiles={maxFiles}
          />

          {files.length > 0 && (
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Rename Rules</Label>
                <div className="flex flex-wrap gap-2">
                  {([
                    { key: "prefix", label: "加Prefix" },
                    { key: "suffix", label: "加Suffix" },
                    { key: "regex", label: "Regex Replace" },
                    { key: "drawing", label: "Drawing Number" },
                  ] as { key: RenameMode; label: string }[]).map((m) => (
                    <Button
                      key={m.key}
                      type="button"
                      variant={mode === m.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMode(m.key)}
                    >
                      {m.label}
                    </Button>
                  ))}
                </div>
              </div>

              {mode === "prefix" && (
                <div>
                  <Label htmlFor="prefix">Prefix</Label>
                  <Input
                    id="prefix"
                    placeholder="e.g. ProjectA_"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                  />
                </div>
              )}

              {mode === "suffix" && (
                <div>
                  <Label htmlFor="suffix">Suffix</Label>
                  <Input
                    id="suffix"
                    placeholder="e.g. _final"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                  />
                </div>
              )}

              {mode === "regex" && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="regexPattern">Regex Pattern</Label>
                    <Input
                      id="regexPattern"
                      placeholder="e.g. ^old_"
                      value={regexPattern}
                      onChange={(e) => setRegexPattern(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="regexReplace">Replace With</Label>
                    <Input
                      id="regexReplace"
                      placeholder="e.g. new_"
                      value={regexReplace}
                      onChange={(e) => setRegexReplace(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {mode === "drawing" && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="drawingProject">Project Name</Label>
                    <Input
                      id="drawingProject"
                      placeholder="e.g. BuildingA"
                      value={drawingProject}
                      onChange={(e) => setDrawingProject(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="drawingStartNum">Starting Number</Label>
                    <Input
                      id="drawingStartNum"
                      type="number"
                      min={1}
                      value={drawingStartNum}
                      onChange={(e) => setDrawingStartNum(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Output format: Project Name_DWG-001.pdf
                  </p>
                </div>
              )}

              <Button onClick={handleRename} disabled={processing} className="w-full">
                {processing ? "Processing..." : "Start Rename"}
              </Button>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {result && (
            <div className="rounded-lg border bg-green-50 p-4 space-y-3">
              <p className="text-sm font-medium text-green-800">Rename Preview</p>
              <div className="space-y-2 max-h-48 overflow-auto">
                {result.previews.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="truncate text-muted-foreground line-through">{p.old}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="truncate font-medium text-green-700">{p.new}</span>
                  </div>
                ))}
              </div>
              <Button
                className="w-full gap-2"
                onClick={() => {
                  saveAs(result.zipUrl, `renamed_pdfs_${Date.now()}.zip`);
                }}
              >
                <FileArchive className="h-4 w-4" />
                Download ZIP (ZIP)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
