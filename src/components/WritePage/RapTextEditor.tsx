import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { useTheme } from '@mui/material';

interface RapTextEditorProps {
  editor: Editor | null;
}

export default function RapTextEditor({ editor }: RapTextEditorProps) {
  const theme = useTheme();

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
