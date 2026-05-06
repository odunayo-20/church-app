"use client";

import { useFormStatus } from "react-dom";

interface DeleteButtonProps {
  message?: string;
}

export function DeleteButton({ message = "Are you sure?" }: DeleteButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="text-sm text-destructive hover:underline disabled:opacity-50"
      onClick={(e) => {
        if (!confirm(message)) {
          e.preventDefault();
        }
      }}
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
