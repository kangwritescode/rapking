import { Box, Button } from '@mui/material';
import { useState } from 'react';
import AddSCDialog from './AddSCDialog';

interface AddSCButtonProps {
  rapId?: string;
  soundCloudUrlData?: string | null;
}

function AddSCButton({ rapId, soundCloudUrlData }: AddSCButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AddSCDialog
        open={open}
        onClose={() => setOpen(false)}
        rapId={rapId}
        soundCloudUrlData={soundCloudUrlData}
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
