import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS class names, auto-resolve conflicts
 * Used for shadcn/ui components and global style merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format file size for display
 * @param bytes File size in bytes
 * @returns e.g. "1.5 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Generate unique filename with timestamp to avoid overwrites
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const lastDot = originalName.lastIndexOf(".");
  if (lastDot === -1) return `${originalName}_${timestamp}`;
  const name = originalName.substring(0, lastDot);
  const ext = originalName.substring(lastDot);
  return `${name}_${timestamp}${ext}`;
}
