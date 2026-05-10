import { MediaLibrary } from "@/components/admin/media/media-library";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Library | Admin",
  description: "Manage your church media assets",
};

export default function MediaPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Media Library</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Manage, upload, and organize your images and files.
        </p>
      </div>
      
      <MediaLibrary />
    </div>
  );
}
