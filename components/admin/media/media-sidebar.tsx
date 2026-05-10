"use client";

import { useState, useEffect, useCallback } from "react";
import { Folder, ChevronRight, ChevronDown, FolderOpen } from "lucide-react";
import { getMediaContentAction, moveMediaAction } from "@/app/action/media-actions";
import { toast } from "sonner";

interface MediaSidebarProps {
  currentFolderId: string | null;
  onFolderSelect: (id: string | null) => void;
}

export function MediaSidebar({ currentFolderId, onFolderSelect }: MediaSidebarProps) {
  const [rootFolders, setRootFolders] = useState<any[]>([]);

  const [refreshKey, setRefreshKey] = useState(0);

  const loadFolders = useCallback(async () => {
    const { folders } = await getMediaContentAction(null);
    setRootFolders(folders);
  }, []);

  useEffect(() => {
    loadFolders();
  }, [loadFolders, refreshKey]);

  useEffect(() => {
    const handleUpdate = () => setRefreshKey(prev => prev + 1);
    window.addEventListener("media-updated", handleUpdate);
    return () => window.removeEventListener("media-updated", handleUpdate);
  }, []);

  return (
    <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden md:flex flex-col">
      <div className="p-4 font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Navigation
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <button
          onClick={() => onFolderSelect(null)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${
            currentFolderId === null 
              ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium" 
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Folder className="w-4 h-4" />
          <span>All Media</span>
        </button>

        {rootFolders.map((folder) => (
          <FolderItem 
            key={folder.id} 
            folder={folder} 
            currentFolderId={currentFolderId} 
            onFolderSelect={onFolderSelect}
            level={0}
          />
        ))}
      </div>
    </div>
  );
}

function FolderItem({ folder, currentFolderId, onFolderSelect, level }: { 
  folder: any, 
  currentFolderId: string | null, 
  onFolderSelect: (id: string | null) => void,
  level: number
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [subFolders, setSubFolders] = useState<any[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadSubFolders = useCallback(async () => {
    const { folders } = await getMediaContentAction(folder.id);
    setSubFolders(folders);
    setHasLoaded(true);
  }, [folder.id]);

  useEffect(() => {
    if (isOpen) {
      loadSubFolders();
    }
  }, [isOpen, loadSubFolders, refreshKey]);

  useEffect(() => {
    const handleUpdate = () => setRefreshKey(prev => prev + 1);
    window.addEventListener("media-updated", handleUpdate);
    return () => window.removeEventListener("media-updated", handleUpdate);
  }, []);

  const isActive = currentFolderId === folder.id;

  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes("item")) {
      e.preventDefault();
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    const data = e.dataTransfer.getData("item");
    if (!data) return;
    
    const draggedItem = JSON.parse(data);
    if (draggedItem.id === folder.id) return;
    
    try {
      await moveMediaAction([{ id: draggedItem.id, type: draggedItem.type }], folder.id);
      toast.success(`Moved ${draggedItem.name} to ${folder.name}`);
      window.dispatchEvent(new CustomEvent("media-updated"));
    } catch (error) {
      toast.error("Failed to move item");
    }
  };

  const toggleOpen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="mb-1">
      <div 
        className={`flex items-center gap-1 group rounded-lg text-sm transition-all cursor-pointer pr-3 ${
          isActive 
            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium" 
            : isDraggingOver
            ? "bg-indigo-100 dark:bg-indigo-900/50 ring-2 ring-indigo-500"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => onFolderSelect(folder.id)}
      >
        <button 
          onClick={toggleOpen}
          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
        >
          {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
        {isActive ? <FolderOpen className="w-4 h-4 shrink-0" /> : <Folder className="w-4 h-4 shrink-0" />}
        <span className="truncate flex-1 py-2">{folder.name}</span>
      </div>

      {isOpen && (
        <div className="mt-1">
          {subFolders.length > 0 ? (
            subFolders.map((sub) => (
              <FolderItem 
                key={sub.id} 
                folder={sub} 
                currentFolderId={currentFolderId} 
                onFolderSelect={onFolderSelect}
                level={level + 1}
              />
            ))
          ) : hasLoaded ? (
            <div 
              className="text-[10px] text-slate-400 py-1" 
              style={{ paddingLeft: `${(level + 1) * 12 + 28}px` }}
            >
              Empty
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
