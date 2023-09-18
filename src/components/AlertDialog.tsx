import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface AlertDialogProps {
  isOpen: boolean;
  handleClose: () => void;
  dialogText: string;
  dialogTitle: string;
  cancelButtonProps?: React.ComponentProps<typeof Button>;
  submitButtonProps?: React.ComponentProps<typeof Button>;
  onSubmitHandler?: () => void;
}

export default function AlertDialog({
  isOpen,
  handleClose,
  dialogText,
  dialogTitle,
  cancelButtonProps,
  submitButtonProps,
  onSubmitHandler,
}: AlertDialogProps) {

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {dialogTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color='inherit'
          onClick={handleClose}
          {...cancelButtonProps}
        >
          Cancel
        </Button>
        <Button
          {...onSubmitHandler && { onClick: onSubmitHandler }}
          autoFocus
          {...submitButtonProps}
        >
          Delete Account
        </Button>
      </DialogActions>
    </Dialog>
  );
}
