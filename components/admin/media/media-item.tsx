"use client";

import { useState, useCallback } from "react";
import { 
  Folder, 
  FileImage, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  ExternalLink,
  Download,
  Copy,
  Check,
  Move
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/form-elements";
import { Button } from "@/components/ui/button";
import { renameMediaAction, deleteMediaAction, moveMediaAction, getMediaUrlAction } from "@/app/action/media-actions";
import { toast } from "sonner";

interface MediaItemProps {
  item: any;
  type: "file" | "folder";
  viewMode: "grid" | "list";
  onClick?: () => void;
  onRefresh: () => void;
  currentFolderId: string | null;
}

export function MediaItem({ item, type, viewMode, onClick, onRefresh, currentFolderId }: MediaItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyUrl = useCallback(async () => {
    if (!previewUrl) return;
    try {
      await navigator.clipboard.writeText(previewUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  }, [previewUrl]);

  const handleRename = async () => {
    if (!newName.trim() || newName === item.name) {
      setIsRenaming(false);
      return;
    }
    try {
      await renameMediaAction(item.id, type, newName);
      toast.success(`${type === "file" ? "File" : "Folder"} renamed`);
      onRefresh();
      setIsRenaming(false);
    } catch (error) {
      toast.error("Failed to rename");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMediaAction([{ id: item.id, type, path: item.file_path }]);
      toast.success("Item deleted");
      onRefresh();
      setIsDeleting(false);
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("item", JSON.stringify({ id: item.id, type, name: item.name }));
    e.dataTransfer.effectAllowed = "move";
    
    // Add a ghost image or style if needed
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (type === "folder" && e.dataTransfer.types.includes("item")) {
      e.preventDefault();
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    if (type !== "folder") return;
    
    e.preventDefault();
    setIsDraggingOver(false);
    
    const data = e.dataTransfer.getData("item");
    if (!data) return;
    
    const draggedItem = JSON.parse(data);
    
    // Prevent moving to self or parent (if same)
    if (draggedItem.id === item.id) return;
    
    try {
      await moveMediaAction([{ id: draggedItem.id, type: draggedItem.type }], item.id);
      toast.success(`Moved ${draggedItem.name} to ${item.name}`);
      onRefresh();
    } catch (error) {
      toast.error("Failed to move item");
    }
  };

  const handlePreview = async () => {
    if (type === "file") {
      try {
        const url = await getMediaUrlAction(item.file_path);
        setPreviewUrl(url);
        setIsPreviewOpen(true);
      } catch (error) {
        toast.error("Failed to load preview");
      }
    } else {
      onClick?.();
    }
  };

  const handleOpenOriginal = async () => {
    try {
      const url = await getMediaUrlAction(item.file_path);
      setPreviewUrl(url);
      setIsPreviewOpen(true);
    } catch {
      toast.error("Failed to load image");
    }
  };

  const isImage = type === "file" && item.file_type?.startsWith("image/");

  return (
    <>
      {viewMode === "grid" ? (
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -4 }}
          draggable
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`group relative flex flex-col items-center p-3 rounded-xl transition-all border-2 cursor-pointer ${
            isDraggingOver 
              ? "bg-indigo-50 border-indigo-500 border-dashed scale-105 z-10" 
              : "bg-white dark:bg-slate-900 border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:shadow-lg dark:hover:shadow-indigo-900/10"
          }`}
          onClick={handlePreview}
        >
          <div className="w-full aspect-square flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 mb-3 overflow-hidden">
            {type === "folder" ? (
              <Folder className={`w-12 h-12 ${isDraggingOver ? "text-indigo-600 scale-110" : "text-indigo-400"} transition-all`} />
            ) : isImage ? (
              <div className="relative w-full h-full">
                <FileImage className="w-10 h-10 text-slate-300 absolute inset-0 m-auto" />
                <div className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110" 
                     style={{ backgroundImage: `url("${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${item.file_path}")` }} />
              </div>
            ) : (
              <FileImage className="w-10 h-10 text-slate-400" />
            )}
          </div>
          
          <div className="w-full text-center">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate px-1">
              {item.name}
            </p>
            {type === "file" && (
              <p className="text-[10px] text-slate-400 mt-0.5">
                {(item.size / 1024).toFixed(1)} KB
              </p>
            )}
          </div>

          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-slate-700">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setIsRenaming(true); }}>
                  <Pencil className="w-4 h-4 mr-2" /> Rename
                </DropdownMenuItem>
                {type === "file" && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    handleOpenOriginal();
                  }}>
                    <ExternalLink className="w-4 h-4 mr-2" /> Open Original
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600"
                  onClick={(e) => { e.stopPropagation(); setIsDeleting(true); }}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
      ) : (
        <div 
          draggable
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex items-center gap-4 p-2 rounded-lg transition-colors cursor-pointer group ${
            isDraggingOver ? "bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-500 ring-inset" : "hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
          onClick={handlePreview}
        >
          <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded bg-slate-50 dark:bg-slate-800">
            {type === "folder" ? (
              <Folder className="w-5 h-5 text-indigo-400" />
            ) : (
              <FileImage className="w-5 h-5 text-slate-400" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
              {item.name}
            </div>
            <div className="text-[10px] text-slate-400">
              {type === "folder" ? "Folder" : `${(item.size / 1024).toFixed(1)} KB • ${new Date(item.createdAt).toLocaleDateString()}`}
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setIsRenaming(true); }}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={(e) => { e.stopPropagation(); setIsDeleting(true); }}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal 
        isOpen={isRenaming} 
        onClose={() => setIsRenaming(false)}
        title={`Rename ${type === "file" ? "File" : "Folder"}`}
      >
        <div className="space-y-4">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsRenaming(false)}>Cancel</Button>
            <Button onClick={handleRename}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isDeleting} 
        onClose={() => setIsDeleting(false)}
        title="Are you sure?"
      >
        <div className="space-y-4">
          <div className="text-sm text-slate-500 mt-2">
            This action cannot be undone. {type === "folder" && "All items inside this folder will also be deleted."}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleting(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isPreviewOpen} 
        onClose={() => { setIsPreviewOpen(false); setIsCopied(false); }}
        maxWidth="max-w-4xl"
      >
        <div className="flex flex-col gap-4">
          {previewUrl && (
            <>
              {/* Image viewer */}
              <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center min-h-[200px]">
                <img
                  src={previewUrl}
                  alt={item.name}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-image.svg"; }}
                />
              </div>

              {/* File info + actions */}
              <div className="flex flex-col gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.name}</p>
                    {item.size && (
                      <p className="text-xs text-slate-500 mt-0.5">{(item.size / 1024).toFixed(1)} KB · {item.file_type}</p>
                    )}
                  </div>
                  <Button size="sm" variant="outline" asChild className="shrink-0">
                    <a href={previewUrl} download={item.name}>
                      <Download className="w-4 h-4 mr-1.5" /> Download
                    </a>
                  </Button>
                </div>

                {/* URL copy row */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-500 dark:text-slate-400 font-mono truncate select-all">
                    {previewUrl}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyUrl}
                    className="shrink-0 transition-all"
                  >
                    {isCopied
                      ? <><Check className="w-4 h-4 mr-1.5 text-green-500" /> Copied!</>
                      : <><Copy className="w-4 h-4 mr-1.5" /> Copy URL</>
                    }
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
