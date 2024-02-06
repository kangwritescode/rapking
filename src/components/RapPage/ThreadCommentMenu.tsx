import { Icon } from '@iconify/react';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import React from 'react';
import toast from 'react-hot-toast';
import { api } from 'src/utils/api';
import AlertDialog from '../AlertDialog';

interface ThreadCommentMenuProps {
  threadCommentId: string;
}

function ThreadCommentMenu({ threadCommentId }: ThreadCommentMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [modalIsOopen, setModalIsOpen] = React.useState(false);

  const { mutate: deleteThreadComment, isLoading } =
    api.threadComments.deleteThreadComment.useMutation();
  const { invalidate: invalidateThreadCommentsCount } =
    api.useContext().threadComments.getThreadCommentsCount;
  const { invalidate: invalidateThreadComments } =
    api.useContext().threadComments.getThreadComments;

  return (
    <Box>
      <IconButton onClick={handleClick}>
        <Icon icon='tdesign:ellipsis' />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            border: theme => `1px solid ${theme.palette.divider}`
          }
        }}
      >
        <MenuItem onClick={handleClose}>
          <Typography onClick={() => setModalIsOpen(true)} color='error'>
            Delete
          </Typography>
        </MenuItem>
      </Menu>
      <AlertDialog
        isOpen={modalIsOopen}
        handleClose={() => setModalIsOpen(false)}
        dialogTitle='Delete comment?'
        dialogText='Comment will be deleted forever.'
        submitButtonProps={{
          color: 'error'
        }}
        onSubmitHandler={() =>
          deleteThreadComment(
            { id: threadCommentId },
            {
              onSuccess: () => {
                invalidateThreadCommentsCount();
                invalidateThreadComments();
                handleClose();
              },
              onError: () => {
                toast.error('Something went wrong. Please try again.');
              }
            }
          )
        }
        actionButtonText='Delete Comment'
        isLoading={isLoading}
      />
    </Box>
  );
}

export default ThreadCommentMenu;
