import { Box, Button } from '@mui/material';
import { useState } from 'react';
import AddYTDialog from './AddYTDialog.tsx';

interface AddYTButtonProps {
  youtubeVideoIdDefault?: string | null;
  setYoutubeVideoId: (url: string) => void;
}

function AddYTButton({ youtubeVideoIdDefault, setYoutubeVideoId }: AddYTButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AddYTDialog
        open={open}
        onClose={() => setOpen(false)}
        youtubeVideoIdData={youtubeVideoIdDefault}
        onSubmitHandler={url => setYoutubeVideoId(url)}
      />
      <Button
        variant='outlined'
        color='secondary'
        sx={{ width: '100%' }}
        onClick={() => setOpen(true)}
      >
        <Box component='span' color='#FF0000'>
          + Youtube
        </Box>
      </Button>
    </>
  );
}

export default AddYTButton;
