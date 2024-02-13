import { Button, Divider, Stack, Typography } from '@mui/material';
import { Rap } from '@prisma/client';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import GenericTipTapEditor from '../GenericTipTapEditor';
import ReviewPart from './ReviewPart';

interface ReviewMakerProps {
  rapData?: Rap | null;
}

function ReviewMaker({ rapData }: ReviewMakerProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Leave a review...'
      })
    ]
  });

  return (
    <Stack
      sx={{
        p: '1rem 2rem',
        height: '100%',
        position: 'relative'
      }}
    >
      <Typography variant='h4' fontWeight='600'>
        '{rapData?.title}' Review
      </Typography>
      <Divider
        sx={{
          mt: '.5rem',
          mb: '1rem'
        }}
      />
      <ReviewPart
        title='Lyricism'
        subtitle='Rhymes, punchlines, literary devices, and structure.'
        defaultValue={4.5}
        onChange={() => {}}
        sx={{ mb: '1rem' }}
      />
      <ReviewPart
        title='Flow'
        subtitle='Rhythm, cadence, pace, and timing of the lyrics.'
        defaultValue={4.5}
        onChange={() => {}}
        sx={{ mb: '1rem' }}
      />
      <ReviewPart
        title='Originality'
        subtitle='Creativity, uniqueness, and innovation.'
        defaultValue={4.5}
        onChange={() => {}}
        sx={{ mb: '1rem' }}
      />
      <ReviewPart
        title='Delivery (Optional)'
        subtitle='Vocal performance, emotion, and energy.'
        defaultValue={4.5}
        onChange={() => {}}
        sx={{ mb: '1rem' }}
      />
      <Typography variant='h6' fontWeight={600} mb='.5rem'>
        Written Review (Optional)
      </Typography>
      <GenericTipTapEditor editor={editor} />
      <Stack
        width='100%'
        sx={{
          mt: '1.5rem'
        }}
      >
        <Button
          sx={{
            flexGrow: 1
          }}
          variant='contained'
        >
          Submit
        </Button>
      </Stack>
    </Stack>
  );
}

export default ReviewMaker;
