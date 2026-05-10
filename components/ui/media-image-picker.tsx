"use client";

import { useState } from "react";
import { Images, X, ImageOff } from "lucide-react";
import { MediaPickerModal } from "./media-picker-modal";
import Image from "next/image";

interface MediaImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  accentColor?: "indigo" | "rose" | "amber" | "emerald";
}

const accentMap = {
  indigo: "border-indigo-200 hover:border-indigo-400 focus-within:ring-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-900/10",
  rose: "border-rose-200 hover:border-rose-400 focus-within:ring-rose-500/20 bg-rose-50/30 dark:bg-rose-900/10",
  amber: "border-amber-200 hover:border-amber-400 focus-within:ring-amber-500/20 bg-amber-50/30 dark:bg-amber-900/10",
  emerald: "border-emerald-200 hover:border-emerald-400 focus-within:ring-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-900/10",
};
const buttonMap = {
  indigo: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none",
  rose: "bg-rose-600 hover:bg-rose-700 shadow-rose-200 dark:shadow-none",
  amber: "bg-amber-600 hover:bg-amber-700 shadow-amber-200 dark:shadow-none",
  emerald: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 dark:shadow-none",
};

export function MediaImagePicker({
  value,
  onChange,
  label,
  hint,
  accentColor = "indigo",
}: MediaImagePickerProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Images className="w-4 h-4 text-muted-foreground" />
          {label}
        </label>
      )}

      {value ? (
        /* Preview */
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
          <div className="relative aspect-video w-full">
            <Image
              src={value}
              alt="Selected image"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          {/* Overlay actions */}
          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className={`px-4 py-2 text-sm font-medium text-white rounded-xl shadow-lg transition-all ${buttonMap[accentColor]}`}
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg transition-all flex items-center gap-1.5"
            >
              <X className="w-4 h-4" /> Remove
            </button>
          </div>
        </div>
      ) : (
        /* Empty picker */
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className={`w-full rounded-2xl border-2 border-dashed transition-all p-8 flex flex-col items-center gap-3 group ${accentMap[accentColor]}`}
        >
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ImageOff className="w-6 h-6 text-slate-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Choose from Media Library</p>
            <p className="text-xs text-slate-400 mt-0.5">Pick an image you've already uploaded</p>
          </div>
        </button>
      )}

      {hint && <p className="text-xs text-muted-foreground ml-1">{hint}</p>}

      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={onChange}
      />
    </div>
  );
}
