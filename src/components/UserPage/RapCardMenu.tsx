import { Icon } from '@iconify/react';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import AlertDialog from '../AlertDialog';
import { api } from 'src/utils/api';
import toast from 'react-hot-toast';

interface RapCardMenuProps {
  rapId: string;
}

function RapCardMenu({ rapId }: RapCardMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const editClickHandler = () => {
    handleClose();
    router.push(`/write/${rapId}`);
  };

  const [modalIsOopen, setModalIsOpen] = React.useState(false);

  const { mutate: deleteRap, isLoading } = api.rap.deleteRap.useMutation();
  const {invalidate: invalidateRaps} = api.useContext().rap.getRapsByUser;

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        sx={{
          mt: 4
        }}
      >
        <Icon icon='tdesign:ellipsis' />
      </IconButton>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={editClickHandler}>Edit</MenuItem>
        <MenuItem onClick={handleClose}>
          <Typography onClick={() => setModalIsOpen(true)} color='error'>
            Delete
          </Typography>
        </MenuItem>
      </Menu>
      <AlertDialog
        isOpen={modalIsOopen}
        handleClose={() => setModalIsOpen(false)}
        dialogTitle='Delete this rap forever?'
        dialogText='Deletion is not reversible, and the rap will be completely deleted.'
        submitButtonProps={{
          color: 'error'
        }}
        onSubmitHandler={() =>
          deleteRap({id: rapId}, {
            onSuccess: () => {
              invalidateRaps();
            },
            onError: () => {
              toast.error('Something went wrong. Please try again.');
            }
          })
        }
        actionButtonText='Delete Account'
        isLoading={isLoading}
      />
    </Box>
  );
}

export default RapCardMenu;
