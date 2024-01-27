import { Button, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AlertDialog from 'src/components/AlertDialog';
import { api } from 'src/utils/api';

function SettingsPage() {
  const theme = useTheme();
  const [modalIsOopen, setModalIsOpen] = useState(false);

  const { mutate: deleteUser } = api.user.deleteUser.useMutation();
  const router = useRouter();

  return (
    <Stack
      sx={{
        padding: `3rem ${theme.spacing(6)} 2rem`,
        transition: 'padding .25s ease-in-out',
        [theme.breakpoints.down('sm')]: {
          paddingLeft: theme.spacing(4),
          paddingRight: theme.spacing(4)
        }
      }}
    >
      <Typography variant='h5' sx={{ mb: theme.spacing(4) }}>
        Settings
      </Typography>
      <AlertDialog
        isOpen={modalIsOopen}
        handleClose={() => setModalIsOpen(false)}
        dialogText="This action is irreversible. You'll lose all your raps, points, and followers if you delete your account."
        dialogTitle='Delete your account forever?'
        submitButtonProps={{
          color: 'error'
        }}
        onSubmitHandler={() =>
          deleteUser(undefined, {
            onSuccess: () => {
              router.reload();
            }
          })
        }
        actionButtonText='Delete Account'
      />
      <Button
        sx={{
          width: 'fit-content'
        }}
        variant='contained'
        color='error'
        onClick={() => setModalIsOpen(true)}
      >
        Delete Account
      </Button>
    </Stack>
  );
}

export default SettingsPage;
