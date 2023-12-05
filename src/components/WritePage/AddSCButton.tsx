import { Box, Button } from '@mui/material';
import { useState } from 'react';
import AddSCDialog from './AddSCDialog';

interface AddSCButtonProps {
  soundCloudUrlDefault?: string | null;
  setSoundcloudUrl: (url: string) => void;
}

function AddSCButton({ soundCloudUrlDefault, setSoundcloudUrl }: AddSCButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AddSCDialog
        open={open}
        onClose={() => setOpen(false)}
        soundCloudUrlData={soundCloudUrlDefault}
        onSubmitHandler={url => setSoundcloudUrl(url)}
      />
      <Button
        variant='outlined'
        color='secondary'
        sx={{ width: '100%' }}
        onClick={() => setOpen(true)}
      >
        <Box component='span' color='#ff7700'>
          + Soundcloud
        </Box>
      </Button>
    </>
  );
}

export default AddSCButton;
