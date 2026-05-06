"use client";

import type { Editor } from "@tiptap/react";
import { useState } from "react";

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  if (!editor) return null;

  const setLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  };

  const addImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const buttons = [
    {
      label: "B",
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
      className: "font-bold",
    },
    {
      label: "I",
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
      className: "italic",
    },
    {
      label: "U",
      action: () => editor.chain().focus().toggleUnderline().run(),
      active: editor.isActive("underline"),
      className: "underline",
    },
    {
      label: "H1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
      className: "",
    },
    {
      label: "H2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
      className: "",
    },
    {
      label: "H3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
      className: "",
    },
    {
      label: "• List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
      className: "",
    },
    {
      label: "1. List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
      className: "",
    },
    {
      label: "> Quote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
      className: "",
    },
    {
      label: "Code",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      active: editor.isActive("codeBlock"),
      className: "font-mono",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-input bg-muted/50 p-2">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          type="button"
          onClick={btn.action}
          className={`rounded px-2 py-1 text-sm transition-colors hover:bg-accent ${
            btn.active ? "bg-accent font-medium" : ""
          } ${btn.className}`}
        >
          {btn.label}
        </button>
      ))}

      <div className="ml-auto flex items-center gap-1">
        {showLinkInput ? (
          <div className="flex items-center gap-1">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              className="w-40 rounded border border-input bg-background px-2 py-1 text-sm"
              autoFocus
            />
            <button
              type="button"
              onClick={setLink}
              className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                setShowLinkInput(false);
              }}
              className="rounded px-2 py-1 text-xs hover:bg-accent"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setShowLinkInput(true);
              setLinkUrl(editor.getAttributes("link").href || "");
            }}
            className={`rounded px-2 py-1 text-sm transition-colors hover:bg-accent ${
              editor.isActive("link") ? "bg-accent" : ""
            }`}
          >
            Link
          </button>
        )}
        <button
          type="button"
          onClick={addImage}
          className="rounded px-2 py-1 text-sm transition-colors hover:bg-accent"
        >
          Image
        </button>
      </div>
    </div>
  );
}
