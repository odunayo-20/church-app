"use client";

import { useState, useRef } from "react";
import { Upload, FileImage, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadMediaAction } from "@/app/action/media-actions";
import { toast } from "sonner";

interface UploadZoneProps {
  children: React.ReactNode;
  onUploadSuccess: () => void;
  currentFolderId: string | null;
  isUploading: boolean;
  setIsUploading: (val: boolean) => void;
}

export function UploadZone({ children, onUploadSuccess, currentFolderId, isUploading, setIsUploading }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    // Filter only images
    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    
    if (imageFiles.length === 0) {
      toast.error("Only image files are allowed");
      return;
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const validFiles = imageFiles.filter(file => file.size <= MAX_SIZE);
    
    if (validFiles.length < imageFiles.length) {
      toast.error(`${imageFiles.length - validFiles.length} file(s) were skipped because they exceed the 10MB limit`);
    }

    if (validFiles.length === 0) return;

    if (imageFiles.length < files.length) {
      toast.warning(`Skipped ${files.length - imageFiles.length} non-image files`);
    }

    setIsUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (const file of validFiles) {
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        await uploadMediaAction(formData, currentFolderId);
        successCount++;
      } catch (error: any) {
        const msg = error?.message || "";
        if (msg.includes("Body exceeded") || msg.includes("413")) {
          toast.error(`"${file.name}" is too large. Please keep images under 10MB.`);
          failCount++;
        } else {
          failCount++;
          console.error(`Failed to upload ${file.name}:`, error);
        }
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} image(s)`);
      onUploadSuccess();
    }
    
    if (failCount > 0) {
      toast.error(`Failed to upload ${failCount} file(s)`);
    }

    setIsUploading(false);
  };

  return (
    <div 
      className="relative min-h-[400px] h-full"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}

      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-indigo-600/10 dark:bg-indigo-600/20 backdrop-blur-sm border-2 border-dashed border-indigo-500 rounded-2xl pointer-events-none"
          >
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 text-center transform scale-110">
              <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                <Upload className="w-10 h-10 text-indigo-600 animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Drop to upload</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Release to add your images to this folder</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                <FileImage className="w-3 h-3" />
                Only Pictures Allowed
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isUploading && (
        <div className="absolute bottom-4 right-4 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Uploading media...</span>
        </div>
      )}
    </div>
  );
}
