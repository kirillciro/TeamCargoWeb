"use client";

import { useRef, useState } from "react";
import { fetchWithAuth } from "@/lib/auth-client";
import { Loader2, Upload, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function CloudinaryLogoUpload({
  value,
  onChange,
  folder,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (folder) fd.append("folder", folder);
      const res = await fetchWithAuth("/api/admin/cloudinary/upload", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(body.message ?? "Upload failed");
      }
      const data = (await res.json()) as { url: string };
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) void uploadFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void uploadFile(file);
    // reset so same file can be picked again
    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-2 flex-1">
      {/* Drop zone / trigger */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative flex items-center justify-center w-16 h-10 rounded-lg border-2 border-dashed cursor-pointer transition-colors shrink-0
          ${
            dragging
              ? "border-amber-400 bg-amber-400/10"
              : "border-slate-600 hover:border-slate-400 bg-slate-800"
          }`}
      >
        {uploading ? (
          <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
        ) : value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="logo"
            className="h-7 w-full object-contain px-1"
          />
        ) : (
          <Upload className="w-4 h-4 text-slate-500" />
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      {/* URL text input — still editable manually */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Drop image or paste URL"
        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
      />

      {/* Clear */}
      {value && !uploading && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-slate-500 hover:text-red-400 transition-colors shrink-0"
          title="Clear"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Inline error */}
      {error && <span className="text-xs text-red-400 shrink-0">{error}</span>}
    </div>
  );
}
