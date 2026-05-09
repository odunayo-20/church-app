"use client";

import { useState } from "react";
import { DeleteModal } from "./delete-modal";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  message?: string;
  onDelete?: () => void | Promise<void>;
  isLoading?: boolean;
}

export function DeleteButton({ 
  message = "Are you sure you want to delete this item? This action cannot be undone.", 
  onDelete,
  isLoading 
}: DeleteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete();
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={isLoading}
        onClick={() => setIsModalOpen(true)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 bg-background text-destructive transition-colors hover:border-red-500/30 hover:bg-red-500/10"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        message={message}
        isLoading={isLoading}
      />
    </>
  );
}
