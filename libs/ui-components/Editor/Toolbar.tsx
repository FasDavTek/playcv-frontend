import { Editor } from "@tiptap/react";
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import TitleIcon from '@mui/icons-material/Title';
import React from "react";
import { ToggleButtonGroup } from "@mui/material";
import ToggleButton from '@mui/material/ToggleButton';

type Props = {
    editor: Editor | null
}

export function Toolbar({ editor }: Props) {
    if (!editor) {
        return null
    }

    return (
        <div className="border w-auto bg-transparent rounded-md">
            <ToggleButtonGroup size='small' >
                <ToggleButton
                    value='bold'
                    onClick={() => (editor as any).chain().focus().toggleBold().run()}
                    aria-label="bold"
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'is-active' : ''}
                    >
                    <FormatBoldIcon />
                </ToggleButton>
                <ToggleButton
                    value='heading'
                    onClick={() => (editor as any).chain().focus().toggleHeading({ level: 2 }).run()}
                    aria-label="heading"
                    // disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                    >
                    <TitleIcon />
                </ToggleButton>
                <ToggleButton
                    value='italic'
                    onClick={() => (editor as any).chain().focus().toggleItalic().run()}
                    aria-label="italic"
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'is-active' : ''}
                    >
                    <FormatItalicIcon />
                </ToggleButton>
                <ToggleButton
                    value='bulletList'
                    onClick={() => (editor as any).chain().focus().toggleBulletList().run()}
                    aria-label="bulletList"
                    className={editor.isActive('bulletList') ? 'is-active' : ''}
                    >
                    <FormatListBulletedIcon />
                </ToggleButton>
                <ToggleButton
                    value='orderedList'
                    onClick={() => (editor as any).chain().focus().toggleOrderedList().run()}
                    aria-label="orderedList"
                    className={editor.isActive('orderedList') ? 'is-active' : ''}
                    >
                    <FormatListNumberedIcon />
                </ToggleButton>
                <ToggleButton
                    value='strike'
                    onClick={() => (editor as any).chain().focus().toggleStrike().run()}
                    aria-label="strike"
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={editor.isActive('strike') ? 'is-active' : ''}
                    >
                    <FormatStrikethroughIcon />
                </ToggleButton>
                <ToggleButton
                    value='undo'
                    onClick={() => (editor as any).chain().focus().undo().run()}
                    aria-label="undo"
                    disabled={!editor.can().chain().focus().undo().run()}
                    >
                    <UndoIcon />
                </ToggleButton>
                <ToggleButton
                    value='redo'
                    onClick={() => (editor as any).chain().focus().redo().run()}
                    aria-label="redo"
                    disabled={!editor.can().chain().focus().redo().run()}
                    >
                    <RedoIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    )
};