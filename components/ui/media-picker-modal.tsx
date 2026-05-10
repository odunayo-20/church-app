"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Folder, FolderOpen, ChevronRight, ChevronDown, Search, Check, Loader2, Home } from "lucide-react";
import { getMediaContentAction, getMediaUrlAction } from "@/app/action/media-actions";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

// ---------------------------------------------------------------------------
// Sidebar folder tree item
// ---------------------------------------------------------------------------
function SidebarFolderItem({
  folder,
  currentFolderId,
  onFolderSelect,
  level,
}: {
  folder: any;
  currentFolderId: string | null;
  onFolderSelect: (id: string | null) => void;
  level: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [subFolders, setSubFolders] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  const toggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && !loaded) {
      const { folders } = await getMediaContentAction(folder.id);
      setSubFolders(folders);
      setLoaded(true);
    }
    setIsOpen((v) => !v);
  };

  const isActive = currentFolderId === folder.id;

  return (
    <div className="mb-0.5">
      <div
        className={`flex items-center gap-1 rounded-lg text-sm cursor-pointer pr-2 transition-colors ${
          isActive
            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => onFolderSelect(folder.id)}
      >
        <button onClick={toggle} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700">
          {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
        {isActive ? (
          <FolderOpen className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <Folder className="w-3.5 h-3.5 shrink-0" />
        )}
        <span className="truncate flex-1 py-1.5 text-xs">{folder.name}</span>
      </div>
      {isOpen && (
        <div>
          {subFolders.length > 0
            ? subFolders.map((sub) => (
                <SidebarFolderItem
                  key={sub.id}
                  folder={sub}
                  currentFolderId={currentFolderId}
                  onFolderSelect={onFolderSelect}
                  level={level + 1}
                />
              ))
            : loaded && (
                <p
                  className="text-[10px] text-slate-400 py-1"
                  style={{ paddingLeft: `${(level + 1) * 12 + 28}px` }}
                >
                  Empty
                </p>
              )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main modal
// ---------------------------------------------------------------------------
export function MediaPickerModal({ isOpen, onClose, onSelect, title = "Choose an Image" }: MediaPickerModalProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState<any>(null);
  const [rootFolders, setRootFolders] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [confirming, setConfirming] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const load = useCallback(async (folderId: string | null) => {
    setLoading(true);
    try {
      const data = await getMediaContentAction(folderId);
      setFolders(data.folders);
      setFiles(data.files);
      setCurrentFolder(data.currentFolder);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load root folders once
  useEffect(() => {
    if (!isOpen) return;
    getMediaContentAction(null).then(({ folders }) => setRootFolders(folders));
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      load(currentFolderId);
      setSelected(null);
    }
  }, [isOpen, currentFolderId, load]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleConfirm = async () => {
    if (!selected) return;
    setConfirming(true);
    try {
      const url = await getMediaUrlAction(selected.file_path);
      onSelect(url);
      onClose();
      setSelected(null);
    } finally {
      setConfirming(false);
    }
  };

  const filteredFolders = folders.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
  const filteredFiles = files.filter(
    (f) => f.name.toLowerCase().includes(search.toLowerCase()) && f.file_type?.startsWith("image/")
  );

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
            className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col"
            style={{ maxHeight: "80vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-48 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col overflow-y-auto p-2">
                <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Folders</p>
                <button
                  onClick={() => setCurrentFolderId(null)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs mb-1 transition-colors ${
                    currentFolderId === null
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 font-medium"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Home className="w-3.5 h-3.5" /> All Media
                </button>
                {rootFolders.map((f) => (
                  <SidebarFolderItem
                    key={f.id}
                    folder={f}
                    currentFolderId={currentFolderId}
                    onFolderSelect={setCurrentFolderId}
                    level={0}
                  />
                ))}
              </div>

              {/* Main */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Breadcrumb + search */}
                <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <button onClick={() => setCurrentFolderId(null)} className="hover:text-indigo-600 flex items-center gap-1">
                      <Home className="w-3 h-3" /> Root
                    </button>
                    {currentFolder && (
                      <>
                        <ChevronRight className="w-3 h-3" />
                        <span className="font-medium text-slate-800 dark:text-white">{currentFolder.name}</span>
                      </>
                    )}
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search..."
                      className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/30 w-44"
                    />
                  </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                  {loading ? (
                    <div className="flex items-center justify-center h-40">
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                    </div>
                  ) : filteredFolders.length === 0 && filteredFiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                      <Folder className="w-10 h-10 mb-2 opacity-20" />
                      <p className="text-sm">No images here</p>
                      <p className="text-xs mt-1">Upload images in the Media Library first</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {filteredFolders.map((folder) => (
                        <button
                          key={folder.id}
                          onClick={() => setCurrentFolderId(folder.id)}
                          className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                        >
                          <Folder className="w-10 h-10 text-indigo-400 group-hover:text-indigo-500 transition-colors" />
                          <p className="text-xs text-slate-600 dark:text-slate-400 truncate w-full text-center">{folder.name}</p>
                        </button>
                      ))}
                      {filteredFiles.map((file) => {
                        const imgUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${file.file_path}`;
                        const isSelected = selected?.id === file.id;
                        return (
                          <button
                            key={file.id}
                            onClick={() => setSelected(isSelected ? null : file)}
                            className={`relative rounded-xl overflow-hidden border-2 transition-all aspect-square group ${
                              isSelected
                                ? "border-indigo-500 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 scale-[1.02]"
                                : "border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                            }`}
                          >
                            <div
                              className="w-full h-full bg-cover bg-center transition-transform group-hover:scale-105"
                              style={{ backgroundImage: `url("${imgUrl}")` }}
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                                <div className="bg-indigo-600 rounded-full p-1.5 shadow-lg">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
              <p className="text-xs text-slate-500">
                {selected ? (
                  <span className="font-medium text-indigo-600">{selected.name} selected</span>
                ) : (
                  "Click an image to select it"
                )}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selected || confirming}
                  className="px-4 py-2 text-sm rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
                >
                  {confirming && <Loader2 className="w-4 h-4 animate-spin" />}
                  Insert Image
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
