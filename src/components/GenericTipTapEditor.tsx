import { RichTextEditor } from '@mantine/tiptap';
import { useTheme } from '@mui/material';
import { Editor } from '@tiptap/react';

interface GenericTipTapEditorProps {
  editor: Editor | null;
}

export default function GenericTipTapEditor({ editor }: GenericTipTapEditorProps) {
  const theme = useTheme();

  return (
    <RichTextEditor
      sx={{
        border: 'unset',
        '& .ProseMirror': {
          minHeight: '4rem'
        }
      }}
      editor={editor}
      styles={{
        content: {
          background: theme.palette.grey[900],
          color: theme.palette.text.primary,
          width: '100%',
          minHeight: '4rem',
          fontSize: '10pt'
        },
        toolbar: {
          background: theme.palette.grey[900]
        },
        control: {
          color: theme.palette.text.primary,
          background: theme.palette.grey[900]
        },
        controlsGroup: {
          '& > *:hover': {
            background: `rgba(255, 255, 255, 0.2) !important`
          }
        }
      }}
    >
      <RichTextEditor.Content spellCheck={false} />
    </RichTextEditor>
  );
}
