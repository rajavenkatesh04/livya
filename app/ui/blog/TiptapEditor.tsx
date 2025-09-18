'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

// A simple toolbar component for Tiptap
const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }

    const buttonClasses = (isActive: boolean) =>
        `p-2 rounded font-mono text-sm ${isActive ? 'bg-gray-200 dark:bg-zinc-700' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`;

    return (
        <div className="flex flex-wrap items-center gap-2 p-2 border-b border-gray-300 dark:border-zinc-700">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClasses(editor.isActive('bold'))} title="Bold"><strong>B</strong></button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClasses(editor.isActive('italic'))} title="Italic"><em>I</em></button>
            <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={buttonClasses(editor.isActive('strike'))} title="Strikethrough"><s>S</s></button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonClasses(editor.isActive('heading', { level: 2 }))}>H2</button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={buttonClasses(editor.isActive('heading', { level: 3 }))}>H3</button>
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClasses(editor.isActive('bulletList'))}>UL</button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClasses(editor.isActive('orderedList'))}>OL</button>
            <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={buttonClasses(editor.isActive('blockquote'))}>“ ”</button>
        </div>
    );
};

// The main Tiptap editor component
export default function TiptapEditor({ content, onChange }: { content: string, onChange: (richText: string) => void }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Disable features if you don't need them
                // For example, to disable horizontal rule:
                // horizontalRule: false,
            }),
            Placeholder.configure({
                placeholder: 'Start writing your amazing blog post here...',
            }),
        ],
        content: content,
        // --- UPDATE: Added as suggested by the error message to help prevent hydration issues ---
        immediatelyRender: false,
        editorProps: {
            attributes: {
                // Using tailwind typography plugin classes for styling the editor content
                class: 'prose dark:prose-invert max-w-none p-4 focus:outline-none min-h-[300px]',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <div className="rounded-md border border-gray-300 bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
