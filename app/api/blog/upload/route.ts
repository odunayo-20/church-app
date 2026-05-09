import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { config } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return errorResponse("No file uploaded", 400);
    }

    if (file.size > config.storage.maxUploadSize) {
      return errorResponse("File size exceeds limit", 400);
    }

    const supabase = await createAdminClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { data, error: uploadError } = await supabase.storage
      .from(config.storage.bucketName)
      .upload(filePath, file, {
        cacheControl: config.storage.cacheControl,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return errorResponse(`Upload failed: ${uploadError.message}`, 500);
    }

    const { data: { publicUrl } } = supabase.storage
      .from(config.storage.bucketName)
      .getPublicUrl(filePath);

    return successResponse({ url: publicUrl });
  } catch (error) {
    console.error("Image upload error:", error);
    return errorResponse("Image upload failed", 500);
  }
}
