import { RichTextEditor } from '@mantine/tiptap';
import { useTheme } from '@mui/material';
import { Editor } from '@tiptap/react';

interface RapTextEditorProps {
  editor: Editor | null;
  sx?: any;
}

export default function RapTextEditor({ editor, sx }: RapTextEditorProps) {
  const theme = useTheme();

  return (
    <RichTextEditor
      style={{ ...sx }}
      editor={editor}
      styles={{
        content: {
          background: theme.palette.background.default,
          color: theme.palette.text.primary,
          width: '100%',
          height: '40rem'
        },
        toolbar: {
          background: theme.palette.background.paper
        },
        control: {
          color: theme.palette.text.primary,
          background: theme.palette.background.paper
        },
        controlsGroup: {
          '& > *:hover': {
            background: `rgba(255, 255, 255, 0.2) !important`
          }
        }
      }}
    >
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignCenter />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content spellCheck={false} />
    </RichTextEditor>
  );
}
