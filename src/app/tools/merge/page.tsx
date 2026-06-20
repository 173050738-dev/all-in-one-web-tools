"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Download, Combine, AlertCircle, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileUploader from "@/components/FileUploader";
import { useQuotaGuard } from "@/hooks/useQuotaGuard";
import { useStore } from "@/store/useStore";

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);
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

  const moveFile = (index: number, direction: "up" | "down") => {
    setFiles((prev) => {
      const next = [...prev];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= next.length) return prev;
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
      return next;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please upload at least 2 PDF files to merge");
      return;
    }
    setError(null);

    const quota = await checkQuota(files.length);
    if (!quota.allowed) {
      setError(quota.reason || "Insufficient quota");
      return;
    }

    setProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes as unknown as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResult({
        url,
        name: `merged_${Date.now()}.pdf`,
      });

      await consumeQuota("merge", files.length);
    } catch (e) {
      setError("Merge failed: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Merge PDF</h1>
        <p className="mt-2 text-muted-foreground">
          Drag and drop multiple files to merge into one PDF
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Combine className="h-5 w-5 text-primary" />
            Upload Files (Reorderable)
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
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Arrange merge order:</p>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-lg border bg-white p-3"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 truncate text-sm">{file.name}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => moveFile(index, "up")}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={index === files.length - 1}
                      onClick={() => moveFile(index, "down")}
                    >
                      ↓
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {files.length >= 2 && (
            <Button
              onClick={handleMerge}
              disabled={processing}
              className="w-full"
            >
              {processing ? "Merging..." : "Start Merge"}
            </Button>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {result && (
            <div className="rounded-lg border bg-green-50 p-4 space-y-3">
              <p className="text-sm text-green-800">Merge complete!</p>
              <Button
                className="w-full gap-2"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = result.url;
                  a.download = result.name;
                  a.click();
                }}
              >
                <Download className="h-4 w-4" />
                Download Merged File
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
