import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import SCPlayer from '../SCPlayer';

interface AddSCDialogProps {
  open: boolean;
  onClose: () => void;
  soundCloudUrlData?: string | null;
  onSubmitHandler?: (url: string) => void;
}

const soundCloudUrlSchema = z.object({
  soundcloudUrl: z
    .string()
    .regex(
      /^(https?:\/\/)?(www\.)?soundcloud\.com\/[A-Za-z0-9-_]+\/[A-Za-z0-9-_]+/,
      'Invalid SoundCloud URL format.'
    )
});
function AddSCDialog({ open, onClose, soundCloudUrlData, onSubmitHandler }: AddSCDialogProps) {
  const {
    register,
    formState: { errors, isValid },
    watch
  } = useForm({
    defaultValues: {
      soundcloudUrl: soundCloudUrlData ?? ''
    },
    resolver: zodResolver(soundCloudUrlSchema),
    mode: 'all'
  });

  const soundcloudUrl = watch('soundcloudUrl');
  const slicedUrl = soundcloudUrl.split('?')[0];

  const addTrackClickHandler = async () => {
    if (!isValid) return;
    onSubmitHandler && onSubmitHandler(slicedUrl);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          pb: '0 !important'
        }}
      >
        Add Soundcloud Track
      </DialogTitle>
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: '1rem',
          top: '1rem'
        }}
      >
        <Icon icon='mdi:close' />
      </IconButton>
      <DialogContent
        sx={theme => ({
          [theme.breakpoints.up('sm')]: {
            width: '30rem'
          }
        })}
      >
        <TextField
          {...register('soundcloudUrl')}
          variant='outlined'
          fullWidth
          placeholder='https://soundcloud.com/artist/track'
          error={Boolean(errors?.soundcloudUrl?.message)}
        />
        {errors?.soundcloudUrl?.message && (
          <Typography
            variant='caption'
            color='error'
            sx={{
              display: 'block',
              mt: '.5rem'
            }}
          >
            {errors.soundcloudUrl.message}
          </Typography>
        )}
        {isValid ? <SCPlayer url={slicedUrl} showArtwork sx={{ mt: '1rem' }} /> : undefined}
      </DialogContent>
      <DialogActions>
        <Button color='inherit' onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          loading={false}
          autoFocus
          variant='contained'
          disabled={!isValid}
          onClick={addTrackClickHandler}
        >
          Add Track
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default AddSCDialog;
