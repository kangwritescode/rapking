import { RichTextEditor } from '@mantine/tiptap';
import { Button, Stack, useTheme } from '@mui/material';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useSession } from 'next-auth/react';

function PulseEditor(): JSX.Element {
  const theme = useTheme();
  const session = useSession();

  const editor = useEditor({
    extensions: [StarterKit, TextAlign.configure({ types: ['heading', 'paragraph'] })],
    content: ''
  });

  if (!session.data?.user?.isAdmin) {
    return <></>;
  }

  return (
    <Stack alignItems='right'>
      <Button
        sx={{
          width: 'fit-content',
          mb: '1rem',
          marginLeft: 'auto'
        }}
        variant='contained'
      >
        Submit
      </Button>
      <RichTextEditor
        editor={editor}
        styles={{
          content: {
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
            width: '100%',
            minHeight: '10rem',
            '& > .ProseMirror': {
              minHeight: '10rem'
            }
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
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content spellCheck={false} />
      </RichTextEditor>
    </Stack>
  );
}

export default PulseEditor;
