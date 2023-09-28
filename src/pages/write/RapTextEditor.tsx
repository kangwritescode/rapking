import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { useTheme } from '@mui/material';


interface RapTextEditorProps {
  onChange: (contentHTML: string) => void;
  content: string;
}

export default function RapTextEditor({ onChange, content }: RapTextEditorProps) {

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    }
  });

  const theme = useTheme()

  return (
    <RichTextEditor
      editor={editor}
      styles={{
        content: {
          background: theme.palette.background.default,
          color: theme.palette.text.primary,
          width: '100%',
          minHeight: '15rem'
        },
        toolbar: {
          background: theme.palette.background.paper,
        },
        control: {
          color: theme.palette.text.primary,
          background: theme.palette.background.paper,
        },
        controlsGroup: {
          '& > *:hover': {
            background: `rgba(255, 255, 255, 0.2) !important`,
          }
        }
      }}>
      <RichTextEditor.Toolbar>
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
