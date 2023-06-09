import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { useTheme } from '@mui/material';

interface TextEditorProps {
    contentMinHeight: number;
    contentWidth: number;
}

const content =
    '';
export default function TextEditor(props: TextEditorProps) {
    const { contentMinHeight, contentWidth } = props;
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content,
    });

    const theme = useTheme()

    return (
        <RichTextEditor
            editor={editor}
            styles={{
                content: {
                    background: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    width: contentWidth,
                    minHeight: contentMinHeight,
                },
                toolbar: {
                    background: theme.palette.background.paper,
                },
                control: {
                    color: theme.palette.text.primary,
                    background: theme.palette.background.paper,
                },
            }}>
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignJustify />
                    <RichTextEditor.AlignRight />
                </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content spellCheck={false} />
        </RichTextEditor>
    );
}