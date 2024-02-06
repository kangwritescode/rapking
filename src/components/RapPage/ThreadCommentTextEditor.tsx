import { RichTextEditor } from '@mantine/tiptap';
import { Box, Button, CircularProgress, useTheme } from '@mui/material';
import { Editor } from '@tiptap/react';

interface ThreadCommentTextEditorProps {
  editor: Editor | null;
  submitButtonIsDisabled?: boolean;
  showSubmitLoader?: boolean;
}

export default function ThreadCommentTextEditor({
  editor,
  submitButtonIsDisabled,
  showSubmitLoader
}: ThreadCommentTextEditorProps) {
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
          background: theme.palette.grey[900],
          borderRadius: '20px'
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
      <RichTextEditor.Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: 'none'
        }}
      >
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold
            sx={{
              border: 'none',
              '&:hover': {
                background: 'none'
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
            size='small'
            disabled={submitButtonIsDisabled}
            sx={{
              borderRadius: '20px',
              textTransform: 'unset',
              width: '5rem',
              height: '2rem'
            }}
          >
            {showSubmitLoader ? <CircularProgress color='inherit' size={18} /> : 'Submit'}
          </Button>
        </Box>
      </RichTextEditor.Toolbar>
    </RichTextEditor>
  );
}
