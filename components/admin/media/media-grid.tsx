"use client";

import { motion } from "framer-motion";
import { Folder, FileImage, MoreVertical, Loader2 } from "lucide-react";
import { MediaItem } from "./media-item";

interface MediaGridProps {
  folders: any[];
  files: any[];
  loading: boolean;
  viewMode: "grid" | "list";
  onFolderClick: (id: string) => void;
  onRefresh: () => void;
  currentFolderId: string | null;
}

export function MediaGrid({ 
  folders, 
  files, 
  loading, 
  viewMode, 
  onFolderClick, 
  onRefresh,
  currentFolderId
}: MediaGridProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-600" />
        <p>Loading media content...</p>
      </div>
    );
  }

  const isEmpty = folders.length === 0 && files.length === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white/50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
        <FileImage className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-lg font-medium">No items found</p>
        <p className="text-sm">Upload images or create folders to get started.</p>
      </div>
    );
  }

  return (
    <div className={viewMode === "grid" 
      ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6" 
      : "flex flex-col gap-2"
    }>
      {folders.map((folder) => (
        <MediaItem
          key={folder.id}
          item={folder}
          type="folder"
          viewMode={viewMode}
          onClick={() => onFolderClick(folder.id)}
          onRefresh={onRefresh}
          currentFolderId={currentFolderId}
        />
      ))}
      {files.map((file) => (
        <MediaItem
          key={file.id}
          item={file}
          type="file"
          viewMode={viewMode}
          onRefresh={onRefresh}
          currentFolderId={currentFolderId}
        />
      ))}
    </div>
  );
}
