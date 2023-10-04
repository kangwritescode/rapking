import { Button, Typography, useTheme } from '@mui/material'
import { useRouter } from 'next/router';
import React from 'react'
import AlertDialog from 'src/components/AlertDialog';
import { api } from 'src/utils/api';

function SettingsPage() {
  const theme = useTheme();
  const [modalIsOopen, setModalIsOpen] = useState(false);

  const { mutate: deleteUser } = api.user.deleteUser.useMutation();
  const router = useRouter();

  return (
    <>
      <Typography
        variant='h5'
        sx={{ mb: theme.spacing(4) }}
      >
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
        onSubmitHandler={() => deleteUser(undefined, {
          onSuccess: () => {
            router.reload();
          }
        })}
      />
      <Button
        variant='contained'
        color='error'
        onClick={() => setModalIsOpen(true)}>
        Delete Account
      </Button>
    </>
  )
}

export default SettingsPage

import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next/types';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {}, // Add props if needed
  };
};
