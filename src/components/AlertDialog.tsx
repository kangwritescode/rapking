import { LoadingButton } from '@mui/lab';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';

interface AlertDialogProps {
  isOpen: boolean;
  handleClose: () => void;
  dialogText: string;
  dialogTitle: string;
  cancelButtonProps?: React.ComponentProps<typeof Button>;
  submitButtonProps?: React.ComponentProps<typeof Button>;
  onSubmitHandler?: () => void;
  actionButtonText: string;
  isLoading?: boolean;
}

export default function AlertDialog({
  isOpen,
  handleClose,
  dialogText,
  dialogTitle,
  cancelButtonProps,
  submitButtonProps,
  onSubmitHandler,
  actionButtonText,
  isLoading
}: AlertDialogProps) {
  const [value, setValue] = React.useState('');

  const disabled = value.toLowerCase() !== 'delete';

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>{dialogText}</DialogContentText>
        <TextField
          sx={{
            mt: '1rem'
          }}
          placeholder="Type 'DELETE' to confirm"
          variant='outlined'
          value={value}
          onChange={e => setValue(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button color='inherit' onClick={handleClose} {...cancelButtonProps}>
          Cancel
        </Button>
        <LoadingButton
          loading={isLoading}
          {...(onSubmitHandler && { onClick: onSubmitHandler })}
          autoFocus
          {...submitButtonProps}
          disabled={disabled}
        >
          {actionButtonText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
