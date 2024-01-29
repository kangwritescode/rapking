import { Box, SxProps } from '@mui/material';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { htmlToText } from 'html-to-text';
import { useEffect } from 'react';

interface TipTapContentProps {
  content: string;
  sx?: SxProps;
  maxLength?: number;
}

const TipTapContent = ({ content, sx, maxLength }: TipTapContentProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false
  });

  useEffect(() => {
    if (editor) {
      let trimmedContent = content;

      if (maxLength) {
        const text = htmlToText(content);
        if (text.length > maxLength) {
          const trimmedText = text.substring(0, maxLength) + '...';
          trimmedContent = trimmedText;
        }
      }

      editor.commands.setContent(trimmedContent);
    }
  }, [content, editor, maxLength]);

  return (
    <Box sx={sx}>
      <EditorContent editor={editor} spellCheck={false} />
    </Box>
  );
};

export default TipTapContent;
