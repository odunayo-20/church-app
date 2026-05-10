"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const BUCKET_NAME = "media";

export async function getMediaContentAction(folderId: string | null = null) {
  try {
    const supabase = await createAdminClient();
    
    // Fetch folders
    let foldersQuery = supabase.from("media_folders").select("*");
    if (folderId) {
      foldersQuery = foldersQuery.eq("parent_id", folderId);
    } else {
      foldersQuery = foldersQuery.is("parent_id", null);
    }
    
    const { data: folders, error: foldersError } = await foldersQuery.order("name");
    if (foldersError) {
      console.error("Folders fetch error:", foldersError);
      throw new Error(`Folders error: ${foldersError.message}`);
    }

    // Fetch files
    let filesQuery = supabase.from("media_files").select("*");
    if (folderId) {
      filesQuery = filesQuery.eq("folder_id", folderId);
    } else {
      filesQuery = filesQuery.is("folder_id", null);
    }
    
    // Try ordering by createdAt, fallback to created_at
    let { data: files, error: filesError } = await filesQuery.order("createdAt", { ascending: false });
    
    if (filesError && filesError.message.includes('column "createdAt" does not exist')) {
      let fallbackQuery = supabase.from("media_files").select("*");
      if (folderId) {
        fallbackQuery = fallbackQuery.eq("folder_id", folderId);
      } else {
        fallbackQuery = fallbackQuery.is("folder_id", null);
      }
      const fallbackResult = await fallbackQuery.order("created_at", { ascending: false });
      files = fallbackResult.data;
      filesError = fallbackResult.error;
    }

    if (filesError) {
      console.error("Files fetch error:", filesError);
      throw new Error(`Files error: ${filesError.message}`);
    }

    // Fetch current folder name if folderId is provided
    let currentFolder = null;
    if (folderId) {
      const { data, error: folderError } = await supabase.from("media_folders").select("*").eq("id", folderId).maybeSingle();
      if (folderError) console.error("Current folder fetch error:", folderError);
      currentFolder = data;
    }

    // Normalize data (ensure camelCase for the UI)
    const normalizedFolders = (folders || []).map(f => ({
      ...f,
      parentId: f.parent_id || f.parentId,
      createdAt: f.createdAt || f.created_at,
      updatedAt: f.updatedAt || f.updated_at,
    }));

    const normalizedFiles = (files || []).map(f => ({
      ...f,
      folderId: f.folder_id || f.folderId,
      filePath: f.file_path || f.filePath,
      fileType: f.file_type || f.fileType,
      createdAt: f.createdAt || f.created_at,
      updatedAt: f.updatedAt || f.updated_at,
    }));

    return { 
      folders: normalizedFolders, 
      files: normalizedFiles, 
      currentFolder: currentFolder ? {
        ...currentFolder,
        parentId: currentFolder.parent_id || currentFolder.parentId,
        createdAt: currentFolder.createdAt || currentFolder.created_at,
        updatedAt: currentFolder.updatedAt || currentFolder.updated_at,
      } : null 
    };
  } catch (error: any) {
    console.error("Error fetching media content:", error);
    const message = error instanceof Error ? error.message : (error?.message || "Unknown error");
    throw new Error(`Failed to fetch media content: ${message}`);
  }
}

export async function createFolderAction(name: string, parentId: string | null = null) {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("media_folders")
      .insert({ name, parent_id: parentId })
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/admin/media");
    return data;
  } catch (error: any) {
    console.error("Error creating folder:", error);
    const message = error instanceof Error ? error.message : (error?.message || "Unknown error");
    throw new Error(`Failed to create folder: ${message}`);
  }
}

export async function uploadMediaAction(formData: FormData, folderId: string | null = null) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    // Security: Only allow pictures
    if (!file.type.startsWith("image/")) {
      throw new Error("Only images are allowed");
    }

    const supabase = await createAdminClient();
    
    // 1. Upload to Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = folderId ? `${folderId}/${fileName}` : fileName;

    // Convert file to ArrayBuffer for more reliable upload in Node.js
    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) throw uploadError;

    // 2. Save to Database
    const { data, error: dbError } = await supabase
      .from("media_files")
      .insert({
        name: file.name,
        folder_id: folderId,
        file_path: filePath,
        file_type: file.type,
        size: file.size,
      })
      .select()
      .single();

    if (dbError) {
      // Cleanup storage if DB fails
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
      throw dbError;
    }

    revalidatePath("/admin/media");
    return data;
  } catch (error: any) {
    console.error("Error uploading media:", error);
    const message = error instanceof Error ? error.message : (error?.message || "Unknown error");
    throw new Error(`Failed to upload media: ${message}`);
  }
}

export async function deleteMediaAction(items: { id: string, type: "file" | "folder", path?: string }[]) {
  try {
    const supabase = await createAdminClient();

    for (const item of items) {
      if (item.type === "file") {
        // Delete from Storage
        if (item.path) {
          await supabase.storage.from(BUCKET_NAME).remove([item.path]);
        }
        // Delete from DB
        await supabase.from("media_files").delete().eq("id", item.id);
      } else {
        // Folder deletion (cascades to files in DB)
        // Note: For full cleanup, we should recursively delete files from storage too
        // For simplicity here, we assume the DB cleanup is the priority, but in a real app, storage cleanup is key.
        await supabase.from("media_folders").delete().eq("id", item.id);
      }
    }

    revalidatePath("/admin/media");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting media:", error);
    const message = error instanceof Error ? error.message : (error?.message || "Unknown error");
    throw new Error(`Failed to delete media items: ${message}`);
  }
}

export async function renameMediaAction(id: string, type: "file" | "folder", newName: string) {
  try {
    const supabase = await createAdminClient();
    const table = type === "file" ? "media_files" : "media_folders";
    
    const { data, error } = await supabase
      .from(table)
      .update({ name: newName })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/admin/media");
    return data;
  } catch (error: any) {
    console.error("Error renaming media:", error);
    const message = error instanceof Error ? error.message : (error?.message || "Unknown error");
    throw new Error(`Failed to rename item: ${message}`);
  }
}

export async function moveMediaAction(items: { id: string, type: "file" | "folder" }[], targetFolderId: string | null) {
  try {
    const supabase = await createAdminClient();

    for (const item of items) {
      if (item.type === "file") {
        await supabase.from("media_files").update({ folder_id: targetFolderId }).eq("id", item.id);
      } else {
        // Prevent moving a folder into itself
        if (item.id === targetFolderId) continue;
        await supabase.from("media_folders").update({ parent_id: targetFolderId }).eq("id", item.id);
      }
    }

    revalidatePath("/admin/media");
    return { success: true };
  } catch (error: any) {
    console.error("Error moving media:", error);
    const message = error instanceof Error ? error.message : (error?.message || "Unknown error");
    throw new Error(`Failed to move items: ${message}`);
  }
}

export async function getMediaUrlAction(path: string) {
  try {
    const supabase = await createAdminClient();
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
    return data.publicUrl;
  } catch (error) {
    console.error("Error getting media URL:", error);
    throw new Error("Failed to get media URL");
  }
}
