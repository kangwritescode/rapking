import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import {
  Box,
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

interface AddSCDialogProps {
  open: boolean;
  onClose: () => void;
}

const soundCloudUrlSchema = z.object({
  soundcloudUrl: z
    .string()
    .regex(
      /^(https?:\/\/)?(www\.)?soundcloud\.com\/[A-Za-z0-9-_]+\/[A-Za-z0-9-_]+/,
      'Invalid SoundCloud URL format.'
    )
});
function AddSCDialog({ open = true, onClose }: AddSCDialogProps) {
  const {
    register,
    formState: { errors, isValid },
    watch
  } = useForm({
    defaultValues: {
      soundcloudUrl: ''
    },
    resolver: zodResolver(soundCloudUrlSchema),
    mode: 'all'
  });

  const soundcloudUrl = watch('soundcloudUrl');
  const slicedUrl = soundcloudUrl.split('?')[0];

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
        sx={{
          width: '30rem'
        }}
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
        {isValid ? (
          <Box
            mt='1rem'
            component='iframe'
            width='100%'
            height='6.25rem'
            allow='autoplay'
            src={`https://w.soundcloud.com/player/?url=${slicedUrl}?show_artwork=true&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=false`}
          />
        ) : undefined}
      </DialogContent>
      <DialogActions>
        <Button color='inherit' onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton loading={false} autoFocus variant='contained'>
          Add Track
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default AddSCDialog;
