import { Icon } from '@iconify/react';
import { IconButton, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Rap } from '@prisma/client';
import ReviewRequester from './ReviewRequester';

interface RequestReviewDialogProps {
  isOpen: boolean;
  handleClose: () => void;
  rap?: Rap | null;
}

function RequestReviewDialog({ isOpen, handleClose, rap }: RequestReviewDialogProps) {
  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth={false}>
      <IconButton
        onClick={handleClose}
        sx={theme => ({
          position: 'absolute',
          right: theme.spacing(2),
          top: theme.spacing(2)
        })}
      >
        <Icon icon='ph:x' />
      </IconButton>
      <DialogTitle>
        <Typography fontSize='1rem' variant='button'>
          Request Review: {rap?.title ? <b>'{rap.title}'</b> : ''}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          width: '40rem'
        }}
      >
        <ReviewRequester rap={rap} />
      </DialogContent>
    </Dialog>
  );
}

export default RequestReviewDialog;
