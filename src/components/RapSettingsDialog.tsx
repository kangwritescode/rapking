import { Icon } from '@iconify/react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Typography
} from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import CollaboratorsInterface from './RapPage/CollaboratorsInterface';
import { RapEditorFormValues } from './WritePage/RapEditor';

interface RapSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  control: Control<RapEditorFormValues>;
}

export default function RapSettingsDialog({ open, onClose, control }: RapSettingsDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={false}>
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
      <DialogTitle>
        <Typography fontSize='1rem' variant='button'>
          Rap Settings
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack bgcolor={theme => theme.palette.grey[900]} p='1rem 1.5rem'>
          <Controller
            name='collaborators'
            control={control}
            render={({ field }) => (
              <CollaboratorsInterface onChange={field.onChange} value={field.value} />
            )}
          />
        </Stack>
        <Stack bgcolor={theme => theme.palette.grey[900]} p='1rem 1.5rem' mt='1rem'>
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
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
