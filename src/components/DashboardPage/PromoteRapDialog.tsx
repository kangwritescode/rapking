import { Icon } from '@iconify/react';
import { IconButton, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Rap } from '@prisma/client';
import RapPromoter from './RapPromoter';

interface PromoteRapDialogProps {
  isOpen: boolean;
  handleClose: () => void;
  rap?: Rap | null;
}

function PromoteRapDialog({ isOpen, handleClose, rap }: PromoteRapDialogProps) {
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
          Promote Rap: {rap?.title ? <b>'{rap.title}'</b> : ''}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          width: {
            xs: '100%',
            md: '36rem'
          }
        }}
      >
        <RapPromoter cancelClickHandler={handleClose} rap={rap} />
      </DialogContent>
    </Dialog>
  );
}

export default PromoteRapDialog;
