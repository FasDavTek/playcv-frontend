// RichTextEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style'
import React from 'react';
import { useEffect } from 'react';
import { Toolbar } from './Toolbar';
import Heading from '@tiptap/extension-heading';

interface RichTextEditorProps {
  value: string;
  onChange: (richText: string) => void;
  placeholder: string;
}

const index = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      TextStyle,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
        'rounded-md border border-input outline-none min-h-[150px] p-4'
      }
    },
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getText();
      // const cleanContent = htmlContent.replace(/^<p>(.*)<\/p>$/, '$1');
      // onChange(cleanContent);
      onChange(htmlContent);
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
    </div>
  );
};

export default index;
