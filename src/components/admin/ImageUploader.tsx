"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { X, ImagePlus, Loader } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  value = [],
  onChange,
  maxImages = 6,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState<number[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error || `Failed to upload ${file.name}`);
      return null;
    }

    const { url } = await res.json();
    return url as string;
  };

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).slice(0, maxImages - value.length);
      if (!fileArray.length) return;

      const indices = fileArray.map((_, i) => value.length + i);
      setUploading(indices);

      const uploaded = await Promise.all(fileArray.map((f) => uploadFile(f)));

      const valid = uploaded.filter(Boolean) as string[];
      onChange([...value, ...valid]);
      setUploading([]);

      if (valid.length) toast.success(`${valid.length} image(s) uploaded!`);
    },
    [value, onChange, maxImages]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const next = value.filter((_, i) => i !== index);
    onChange(next);
  };

  const canAdd = value.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      {canAdd && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
            dragOver
              ? "border-brand-pink bg-brand-pink/5"
              : "border-brand-gold/20 bg-dark-700/50 hover:border-brand-gold/40 hover:bg-dark-700"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            suppressHydrationWarning
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <ImagePlus size={32} className="mx-auto mb-3 text-brand-gold/40" />
          <p className="text-white text-sm font-medium mb-1">
            Drop images here or click to upload
          </p>
          <p className="text-gray-600 text-xs">
            PNG, JPG, WebP up to 5MB · Max {maxImages} images
          </p>
          {value.length > 0 && (
            <p className="text-gray-600 text-xs mt-1">
              {value.length}/{maxImages} uploaded
            </p>
          )}
        </div>
      )}

      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {value.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-white/5">
              <Image
                src={url.startsWith("http") ? url : getImageUrl(url)}
                alt={`Product ${i + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
              >
                <X size={11} />
              </button>
              {i === 0 && (
                <div className="absolute bottom-0 left-0 right-0 text-center py-1 text-[10px] font-bold text-white bg-brand-pink/80 backdrop-blur-sm">
                  Main
                </div>
              )}
            </div>
          ))}

          {/* Loading placeholders */}
          {uploading.map((i) => (
            <div key={`loading-${i}`} className="aspect-square rounded-xl bg-dark-700 border border-white/5 flex items-center justify-center">
              <Loader size={20} className="text-brand-gold animate-spin" />
            </div>
          ))}
        </div>
      )}

      {!canAdd && (
        <p className="text-xs text-gray-600 text-center">
          Maximum {maxImages} images reached. Remove one to add more.
        </p>
      )}
    </div>
  );
}
