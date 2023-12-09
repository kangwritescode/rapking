import { Icon } from '@iconify/react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Switch
} from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { RapEditorFormValues } from './WritePage/RapEditor';

interface RapSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  control: Control<RapEditorFormValues>;
}

export default function RapSettingsDialog({ open, onClose, control }: RapSettingsDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <IconButton
        onClick={onClose}
        sx={theme => ({
          position: 'absolute',
          right: theme.spacing(2),
          top: theme.spacing(2)
        })}
      >
        <Icon icon='ph:x' />
      </IconButton>
      <DialogTitle
        display='flex'
        justifyContent='center'
        alignItems='center'
        sx={theme => ({ p: theme.spacing(3) })}
      >
        Rap Settings
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ width: '20rem' }}>
        <Controller
          name='disableComments'
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch checked={field.value} onChange={field.onChange} />}
              label='Disable Comments'
            />
          )}
        />
      </DialogContent>
    </Dialog>
  );
}
