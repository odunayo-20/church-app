"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getMediaContentAction, 
  createFolderAction, 
  uploadMediaAction, 
  deleteMediaAction, 
  renameMediaAction, 
  moveMediaAction 
} from "@/app/action/media-actions";

export const mediaKeys = {
  all: ["media"] as const,
  content: (folderId: string | null) => [...mediaKeys.all, "content", folderId] as const,
};

export function useMedia(folderId: string | null = null) {
  return useQuery({
    queryKey: mediaKeys.content(folderId),
    queryFn: () => getMediaContentAction(folderId),
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, parentId }: { name: string; parentId: string | null }) => 
      createFolderAction(name, parentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.content(variables.parentId) });
    },
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ formData, folderId }: { formData: FormData; folderId: string | null }) => 
      uploadMediaAction(formData, folderId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.content(variables.folderId) });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMediaAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });
}

export function useRenameMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, type, newName }: { id: string; type: "file" | "folder"; newName: string }) => 
      renameMediaAction(id, type, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });
}

export function useMoveMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ items, targetFolderId }: { items: { id: string, type: "file" | "folder" }[]; targetFolderId: string | null }) => 
      moveMediaAction(items, targetFolderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });
}
