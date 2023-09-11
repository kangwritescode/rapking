import { Box, SxProps } from '@mui/material';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface RapContentProps {
  content: string;
  sx?: SxProps;
}

const RapContent = ({ content, sx }: RapContentProps) => {

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content,
    editable: false,
  })

  return (
    <Box sx={sx}>
      <EditorContent editor={editor} spellCheck={false} />
    </Box>
  )
}

export default RapContent;
