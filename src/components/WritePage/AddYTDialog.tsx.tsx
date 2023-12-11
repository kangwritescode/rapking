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
import YTPlayer from '../YTPlayer';

interface AddYTDialogProps {
  open: boolean;
  onClose: () => void;
  youtubeVideoIdData?: string | null;
  onSubmitHandler?: (url: string) => void;
}

const youtubeVideoIdSchema = z.object({
  youtubeVideoId: z
    .string()
    .regex(
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[A-Za-z0-9_-]+/,
      'Invalid Youtube URL format.'
    )
});

function AddYTDialog({ open, onClose, youtubeVideoIdData, onSubmitHandler }: AddYTDialogProps) {
  const {
    register,
    formState: { errors, isValid },
    watch
  } = useForm({
    defaultValues: {
      youtubeVideoId: youtubeVideoIdData ?? ''
    },
    resolver: zodResolver(youtubeVideoIdSchema),
    mode: 'all'
  });

  const youtubeVideoId = watch('youtubeVideoId');
  let videoId: null | string = null;

  if (youtubeVideoId) {
    const urlParams = new URLSearchParams(youtubeVideoId.split('?')[1]);
    videoId = urlParams.get('v');
  }

  const addTrackClickHandler = async () => {
    if (!isValid) return;
    onSubmitHandler && onSubmitHandler(videoId!);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          pb: '0 !important'
        }}
      >
        Add Youtube Track
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
          {...register('youtubeVideoId')}
          variant='outlined'
          fullWidth
          placeholder='https://youtube.com/artist/track'
          error={Boolean(errors?.youtubeVideoId?.message)}
        />
        {errors?.youtubeVideoId?.message && (
          <Typography
            variant='caption'
            color='error'
            sx={{
              display: 'block',
              mt: '.5rem'
            }}
          >
            {errors.youtubeVideoId.message}
          </Typography>
        )}
        {isValid ? <YTPlayer videoId={videoId} sx={{ mt: '1rem' }} /> : undefined}
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

export default AddYTDialog;
