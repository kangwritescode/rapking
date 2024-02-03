import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AlertDialog from 'src/components/AlertDialog';
import { api } from 'src/utils/api';

function DeleteAccountButton() {
  const [modalIsOopen, setModalIsOpen] = useState(false);

  const { mutate: deleteUser } = api.user.deleteUser.useMutation();
  const router = useRouter();

  return (
    <>
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
    </>
  );
}

export default DeleteAccountButton;
