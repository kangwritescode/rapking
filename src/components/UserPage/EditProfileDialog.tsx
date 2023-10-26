import { Dialog, DialogContent, DialogTitle, Divider, IconButton, useTheme } from '@mui/material';
import React from 'react';
import EditProfileForm from './EditProfileForm';
import { Icon } from '@iconify/react';

interface EditProfileDialogProps {
  isOpen: boolean;
  handleClose: () => void;
}

function EditProfileDialog({ isOpen, handleClose }: EditProfileDialogProps) {
  const theme = useTheme();

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle
        display='flex'
        justifyContent='center'
        sx={{
          p: theme.spacing(3)
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            left: theme.spacing(2),
            top: theme.spacing(2)
          }}
        >
          <Icon icon='eva:close-outline' />
        </IconButton>
        Edit Profile
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ minWidth: '400px' }}>
        <EditProfileForm closeDialogHandler={handleClose} />
      </DialogContent>
    </Dialog>
  );
}

export default EditProfileDialog;
