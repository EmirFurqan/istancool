import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { BubbleMenu } from '@tiptap/extension-bubble-menu';
import { BubbleMenu as BubbleMenuComponent } from '@tiptap/react';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'font-bold bg-gray-200 px-2 py-1 rounded' : 'px-2 py-1 rounded'}><b>B</b></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'italic bg-gray-200 px-2 py-1 rounded' : 'px-2 py-1 rounded'}><i>I</i></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'underline bg-gray-200 px-2 py-1 rounded' : 'px-2 py-1 rounded'}>U</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-gray-200 px-2 py-1 rounded' : 'px-2 py-1 rounded'}>• Liste</button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-gray-200 px-2 py-1 rounded' : 'px-2 py-1 rounded'}>1. Liste</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 px-2 py-1 rounded' : 'px-2 py-1 rounded'}>H1</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 px-2 py-1 rounded' : 'px-2 py-1 rounded'}>H2</button>
    </div>
  );
};

const CustomLink = Link.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      'a',
      {
        ...HTMLAttributes,
        class: (HTMLAttributes.class || '') + ' text-blue-600 underline',
      },
      0,
    ];
  },
});

const ParagraphBlockEdit = ({ value, onChange }) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const inputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      CustomLink,
      BubbleMenu,
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'border border-gray-200 rounded-lg p-2 min-h-[80px] focus:outline-none',
        placeholder: 'Paragraf metni...'
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (showLinkInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showLinkInput]);

  const isLinkActive = editor?.isActive('link');
  const hasSelection = editor?.state?.selection?.empty === false;

  return (
    <div>
      <MenuBar editor={editor} />
      {editor && (
        <BubbleMenuComponent editor={editor} tippyOptions={{ duration: 100 }} className="bg-white border border-gray-200 rounded shadow p-2 flex gap-2 items-center">
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'font-bold bg-gray-200 px-2 py-1 rounded' : 'px-2 py-1 rounded'}><b>B</b></button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'italic bg-gray-200 px-2 py-1 rounded' : 'px-2 py-1 rounded'}><i>I</i></button>
          <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'underline bg-gray-200 px-2 py-1 rounded' : 'px-2 py-1 rounded'}>U</button>
          {!isLinkActive && hasSelection && !showLinkInput && (
            <button type="button" onClick={() => { setShowLinkInput(true); setLinkUrl(''); }} className="px-2 py-1 rounded bg-blue-100 text-blue-700">Köprü Ekle</button>
          )}
          {showLinkInput && (
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="url"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                onClick={() => {
                  if (linkUrl) {
                    editor.chain().focus().setLink({ href: linkUrl }).run();
                  }
                  setShowLinkInput(false);
                  setLinkUrl('');
                }}
              >
                Ekle
              </button>
              <button type="button" onClick={() => { setShowLinkInput(false); setLinkUrl(''); }} className="text-gray-500 px-2 py-1 rounded">İptal</button>
            </div>
          )}
          {isLinkActive && (
            <button type="button" onClick={() => { editor.chain().focus().unsetLink().run(); setShowLinkInput(false); }} className="px-2 py-1 rounded bg-red-100 text-red-700">Köprüyü Kaldır</button>
          )}
        </BubbleMenuComponent>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default ParagraphBlockEdit; 