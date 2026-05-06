import { createClient } from "@/lib/supabase/server";

const BUCKET_NAME = "blog-images";

export async function uploadImage(file: File, userId: string): Promise<string> {
  const supabase = await createClient();
  const ext = file.name.split(".").pop() || "png";
  const fileName = `${userId}/${Date.now()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  const supabase = await createClient();
  const path = url.split("/storage/v1/object/public/blog-images/")[1];

  if (!path) return;

  await supabase.storage.from(BUCKET_NAME).remove([path]);
}

export async function getStorageClient() {
  const supabase = await createClient();
  return supabase.storage.from(BUCKET_NAME);
}
