import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import {
  Dialog,
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
    formState: { errors }
  } = useForm({
    defaultValues: {
      soundcloudUrl: ''
    },
    resolver: zodResolver(soundCloudUrlSchema),
    mode: 'all'
  });

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
        {/* <iframe
          width='100%'
          height='100px'
          allow='autoplay'
          src='https://w.soundcloud.com/player/?url=https://soundcloud.com/bsdu/d0000010wav-1?show_artwork=false&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=false'
        /> */}
      </DialogContent>
    </Dialog>
  );
}

export default AddSCDialog;
