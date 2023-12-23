import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { User } from '@prisma/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { api } from 'src/utils/api';
import { z } from 'zod';

interface EditBioDialogProps {
  isOpen: boolean;
  onCloseHandler: () => void;
  userData: User;
}

function EditBioDialog({ isOpen, onCloseHandler, userData }: EditBioDialogProps) {
  const theme = useTheme();

  const { mutate, isLoading } = api.user.updateUser.useMutation();
  const { invalidate: invalidateUserQuery } = api.useContext().user.findByUsername;

  const handleClose = (_: any, reason: string) => {
    if (reason === 'backdropClick') return;
    onCloseHandler();
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    defaultValues: {
      bio: userData.bio || ''
    },
    resolver: zodResolver(
      z.object({
        bio: z.string().max(200)
      })
    ),
    mode: 'onTouched'
  });

  const updateUser = (values: { bio: string }) => {
    mutate(
      {
        bio: values.bio
      },
      {
        onSuccess: () => {
          onCloseHandler();
          invalidateUserQuery();
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit(updateUser)}>
        <IconButton
          onClick={() => handleClose(undefined, '')}
          sx={{
            position: 'absolute',
            left: theme.spacing(2),
            top: theme.spacing(2)
          }}
        >
          <Icon icon='ph:x' />
        </IconButton>
        <DialogTitle
          display='flex'
          justifyContent='center'
          alignItems='center'
          sx={{ p: theme.spacing(3) }}
        >
          Edit Bio
        </DialogTitle>
        <Divider />
        <DialogContent
          sx={{
            minWidth: '400px'
          }}
        >
          <TextField
            {...register('bio')}
            fullWidth
            sx={{ width: '100%' }}
            multiline
            placeholder='Add a bio.'
            error={errors.bio !== undefined}
          />
          {errors.bio && (
            <Typography color='error' sx={{ mt: theme.spacing(2) }}>
              {errors.bio.message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={!isValid || isLoading}
            variant='contained'
            sx={{
              borderRadius: '20px'
            }}
            type='submit'
            size='small'
          >
            Save
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditBioDialog;
