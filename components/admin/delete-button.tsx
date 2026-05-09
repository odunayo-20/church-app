"use client";

interface DeleteButtonProps {
  message?: string;
  onDelete?: () => void | Promise<void>;
  isLoading?: boolean;
}

export function DeleteButton({ 
  message = "Are you sure?", 
  onDelete,
  isLoading 
}: DeleteButtonProps) {
  const handleClick = async (e: React.MouseEvent) => {
    if (onDelete) {
      e.preventDefault();
      if (confirm(message)) {
        await onDelete();
      }
    }
  };

  return (
    <button
      type={onDelete ? "button" : "submit"}
      disabled={isLoading}
      className="text-sm text-destructive hover:underline disabled:opacity-50"
      onClick={handleClick}
    >
      {isLoading ? "Deleting..." : "Delete"}
    </button>
  );
}
