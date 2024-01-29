import { Box, SxProps } from '@mui/material';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface TipTapContentProps {
  content: string;
  sx?: SxProps;
}

const TipTapContent = ({ content, sx }: TipTapContentProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <Box sx={sx}>
      <EditorContent editor={editor} spellCheck={false} />
    </Box>
  );
};

export default TipTapContent;
