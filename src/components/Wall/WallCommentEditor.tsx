import { Box } from '@mui/material';
import { Editor, EditorContent } from '@tiptap/react';

interface WallCommentEditorProps {
  editor: Editor | null;
}

function WallCommentEditor({ editor }: WallCommentEditorProps) {
  return (
    <Box
      sx={{
        '& .is-editor-empty:first-child::before': {
          color: theme => theme.palette.text.disabled,
          content: 'attr(data-placeholder)',
          float: 'left',
          height: 0,
          pointerEvents: 'none'
        },
        '& .ProseMirror': {
          borderTop: '1px solid transparent',
          borderBottom: theme => `1px solid ${theme.palette.divider}`,
          borderRadius: '.25rem',
          minHeight: '3rem',
          px: 4,
          background: '#1f1f1f',
          outline: 'none',
          wordBreak: 'break-word'
        },
        flexGrow: 1
      }}
    >
      <EditorContent editor={editor} spellCheck={false} />
    </Box>
  );
}

export default WallCommentEditor;
