import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { Box, Button, useTheme } from '@mui/material';


interface RapCommentTextEditorProps {
  onChange?: (contentHTML: string) => void;
  content?: string;
  submitButtonIsDisabled?: boolean;
}

export default function RapCommentTextEditor({ onChange, content, submitButtonIsDisabled }: RapCommentTextEditorProps) {

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder: 'Write a comment...',
      })
    ],
    content,
    onUpdate({ editor }) {
      if (onChange) onChange(editor.getHTML());
    }
  });

  const theme = useTheme()

  return (
    <RichTextEditor
      sx={{
        border: 'unset',
        '& .ProseMirror': {
          minHeight: '8rem',
        }
      }}
      editor={editor}
      styles={{
        content: {
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          width: '100%',
          minHeight: '8rem',
          fontSize: '10pt',
        },
        toolbar: {
          background: theme.palette.background.paper,
          borderRadius: '20px',
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
      <RichTextEditor.Content spellCheck={false} />
      <RichTextEditor.Toolbar sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: 'none'
      }}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold
            sx={{
              border: 'none',
              '&:hover': {
                background: 'none',
              }
            }}
          />
          <RichTextEditor.Italic
            sx={{
              border: 'none'
            }}
          />
        </RichTextEditor.ControlsGroup>
        <Box>
          <Button
            type='submit'
            color='primary'
            variant='contained'
            size="small"
            disabled={submitButtonIsDisabled}
            sx={{
              borderRadius: '20px',
              textTransform: 'unset',
            }}>
            Submit
          </Button>
        </Box>
      </RichTextEditor.Toolbar>
    </RichTextEditor>
  );
}
