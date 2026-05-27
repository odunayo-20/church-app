"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  FolderPlus, 
  Upload, 
  Search, 
  Grid, 
  List, 
  ChevronRight, 
  Home,
  Trash2,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getMediaContentAction, createFolderAction, uploadMediaAction, deleteMediaAction } from "@/app/action/media-actions";
import { MediaGrid } from "./media-grid";
import { MediaSidebar } from "./media-sidebar";
import { UploadZone } from "./upload-zone";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/form-elements";
import { Button } from "@/components/ui/button";

export function MediaLibrary() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folders, setFolders] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [currentFolder, setCurrentFolder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMediaContentAction(currentFolderId);
      setFolders(data.folders);
      setFiles(data.files);
      setCurrentFolder(data.currentFolder);
    } catch (error) {
      toast.error("Failed to fetch media content");
    } finally {
      setLoading(false);
      window.dispatchEvent(new CustomEvent("media-updated"));
    }
  }, [currentFolderId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await createFolderAction(newFolderName, currentFolderId);
      toast.success("Folder created successfully");
      setNewFolderName("");
      setIsCreateFolderOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to create folder");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Filter only images
    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    
    if (imageFiles.length === 0) {
      toast.error("Only image files are allowed");
      e.target.value = "";
      return;
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const validFiles = imageFiles.filter(file => file.size <= MAX_SIZE);
    
    if (validFiles.length < imageFiles.length) {
      toast.error(`${imageFiles.length - validFiles.length} file(s) were skipped because they exceed the 10MB limit`);
    }

    if (validFiles.length === 0) {
      e.target.value = "";
      return;
    }

    if (imageFiles.length < files.length) {
      toast.warning(`Skipped ${files.length - imageFiles.length} non-image files`);
    }

    setIsUploading(true);
    let successCount = 0;
    let failCount = 0;

    // Execute uploads in parallel for extreme high performance and responsiveness
    const uploadPromises = validFiles.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        await uploadMediaAction(formData, currentFolderId);
        successCount++;
      } catch (error: any) {
        failCount++;
        const msg = error?.message || "";
        if (msg.includes("Body exceeded") || msg.includes("413")) {
          toast.error(`"${file.name}" is too large. Please keep images under 10MB.`);
        } else {
          toast.error(`Failed to upload "${file.name}"`);
          console.error(`Upload failed for ${file.name}:`, error);
        }
      }
    });

    await Promise.all(uploadPromises);

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} image(s)`);
      fetchData();
    }
    
    if (failCount > 0) {
      toast.error(`Failed to upload ${failCount} image(s)`);
    }

    setIsUploading(false);
    e.target.value = "";
  };

  const filteredFolders = folders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col h-[800px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsCreateFolderOpen(true)}
            className="bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <div className="relative">
            <input
              type="file"
              id="media-upload"
              className="hidden"
              onChange={handleUpload}
              accept="image/*"
              disabled={isUploading}
              multiple
            />
            <Button 
              variant="default" 
              size="sm" 
              asChild
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              <label htmlFor="media-upload" className="cursor-pointer">
                {isUploading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                {isUploading ? "Uploading..." : "Upload Images"}
              </label>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search files and folders..."
              className="pl-9 bg-white dark:bg-slate-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600" : "bg-white dark:bg-slate-900 text-slate-500"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600" : "bg-white dark:bg-slate-900 text-slate-500"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <MediaSidebar 
          currentFolderId={currentFolderId} 
          onFolderSelect={setCurrentFolderId} 
        />

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30 dark:bg-slate-950/30">
          {/* Breadcrumbs */}
          <div className="px-6 py-3 flex items-center gap-2 text-sm text-slate-500 border-b border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900">
            <button 
              onClick={() => setCurrentFolderId(null)}
              className="hover:text-indigo-600 flex items-center transition-colors"
            >
              <Home className="w-4 h-4 mr-1" />
              Root
            </button>
            {currentFolder && (
              <>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <span className="font-medium text-slate-900 dark:text-white truncate">
                  {currentFolder.name}
                </span>
              </>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <UploadZone 
              onUploadSuccess={fetchData} 
              currentFolderId={currentFolderId}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
            >
              <MediaGrid 
                folders={filteredFolders} 
                files={filteredFiles} 
                loading={loading}
                viewMode={viewMode}
                onFolderClick={setCurrentFolderId}
                onRefresh={fetchData}
                currentFolderId={currentFolderId}
              />
            </UploadZone>
          </div>
        </div>
      </div>

      {/* Create Folder Modal */}
      <Modal 
        isOpen={isCreateFolderOpen} 
        onClose={() => setIsCreateFolderOpen(false)}
        title="Create New Folder"
      >
        <div className="space-y-4">
          <Input
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateFolder}>Create Folder</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
