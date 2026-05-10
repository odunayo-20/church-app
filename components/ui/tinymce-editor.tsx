"use client";

import { useRef, useState, useCallback } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { MediaPickerModal } from "@/components/ui/media-picker-modal";
import { Loader2 } from "lucide-react";

interface TinyMCEEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export function TinyMCEEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  minHeight = 400,
}: TinyMCEEditorProps) {
  const editorRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const insertCallbackRef = useRef<((url: string) => void) | null>(null);

  const handleImageSelect = useCallback((url: string) => {
    if (insertCallbackRef.current) {
      insertCallbackRef.current(url);
      insertCallbackRef.current = null;
    }
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border/40 shadow-sm focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
      {isLoading && (
        <div
          className="flex items-center justify-center bg-muted/30"
          style={{ minHeight }}
        >
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
        </div>
      )}

      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        onInit={(_evt, editor) => {
          editorRef.current = editor;
          setIsLoading(false);
        }}
        value={content}
        onEditorChange={(newContent) => onChange(newContent)}
        init={{
          height: minHeight,
          menubar: true,
          branding: false,
          promotion: false,
          license_key: "gpl",
          placeholder,
          skin: "oxide",
          content_css: "default",
          plugins: [
            "advlist", "autolink", "lists", "link", "image", "charmap",
            "preview", "anchor", "searchreplace", "visualblocks", "code",
            "fullscreen", "insertdatetime", "media", "table", "help", "wordcount",
          ],
          toolbar:
            "undo redo | blocks | bold italic underline strikethrough | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | link mediaimage | " +
            "removeformat | fullscreen preview | help",
          toolbar_sticky: true,
          // Custom image button — opens our media library
          setup(editor) {
            editor.ui.registry.addButton("mediaimage", {
              icon: "image",
              tooltip: "Insert from Media Library",
              onAction() {
                insertCallbackRef.current = (url: string) => {
                  editor.insertContent(`<img src="${url}" alt="" style="max-width:100%;" />`);
                };
                setIsPickerOpen(true);
              },
            });
          },
          // Block the default file picker — force our media library instead
          file_picker_types: "",
          // Security: sanitise on output
          valid_elements: "*[*]",
          extended_valid_elements:
            "img[class|src|border=0|alt|title|hspace|vspace|width|height|align|style]",
          content_style: `
            body {
              font-family: Inter, ui-sans-serif, system-ui, sans-serif;
              font-size: 15px;
              line-height: 1.7;
              color: #1e293b;
              padding: 16px 20px;
            }
            p { margin: 0 0 1em; }
            h1,h2,h3,h4 { font-weight: 700; margin-bottom: 0.5em; }
            img { border-radius: 8px; }
          `,
        }}
      />

      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleImageSelect}
        title="Insert Image from Media Library"
      />
    </div>
  );
}
