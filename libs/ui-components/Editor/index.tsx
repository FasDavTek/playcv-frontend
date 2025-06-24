// RichTextEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style'
import React from 'react';
import { useEffect } from 'react';
import { Toolbar } from './Toolbar';
import Heading from '@tiptap/extension-heading';
import CharacterCount from '@tiptap/extension-character-count';

interface RichTextEditorProps {
  value: string;
  onChange: (richText: string) => void;
  placeholder: string;
  maxChars?: number;
}

const index = ({ value, onChange, placeholder, maxChars }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      TextStyle,
      StarterKit,
      ...(maxChars ? [CharacterCount.configure({ limit: maxChars })] : []),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
        'rounded-md border border-input outline-none min-h-[150px] p-4'
      }
    },
    ...(maxChars ? {
      handleDOMEvents: {
        keydown: ({view, event}: any) => {
          // Prevent input if character limit is reached
          if (view.state.doc.textContent.length >= maxChars && event.key.length === 1) {
            event.preventDefault();
            return true;
          }
          return false;
        },
      },
    } : {}),
    onUpdate: ({ editor }) => {
      const plainTextContent = editor.getHTML();
      // const cleanContent = plainTextContent.replace(/^<p>(.*)<\/p>$/, '$1');
      // onChange(cleanContent);
      onChange(plainTextContent);
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="flex flex-col rounded-md gap-1 justify-stretch min-h-[250px]">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} placeholder={placeholder} />
      <p className="text-xs text-red-500 text-left mt-1">
        You can only input {maxChars} characters
      </p>
      {maxChars && editor && (
        <div className="text-xs text-gray-500 text-right mt-1">
          {editor.storage.characterCount.characters()}/{maxChars} characters
        </div>
      )}
    </div>
  );
};

export default index;
