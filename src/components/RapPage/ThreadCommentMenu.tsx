import { Icon } from '@iconify/react';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { ReportedEntity, ThreadComment } from '@prisma/client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from 'src/utils/api';
import AlertDialog from '../AlertDialog';
import ReportDialog from '../ReportDialog';

interface ThreadCommentMenuProps {
  commentData: ThreadComment | null;
  isCurrentUsersComment: boolean;
}

function ThreadCommentMenu({ isCurrentUsersComment, commentData }: ThreadCommentMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [modalIsOopen, setModalIsOpen] = useState(false);
  const [reportDialogIsOpen, setReportDialogIsOpen] = useState<boolean>(false);

  const handleReport = () => {
    setReportDialogIsOpen(true);
    handleClose();
  };

  const { mutate: deleteThreadComment, isLoading } =
    api.threadComments.deleteThreadComment.useMutation();
  const { invalidate: invalidateThreadCommentsCount } =
    api.useUtils().threadComments.getThreadCommentsCount;
  const { invalidate: invalidateThreadComments } = api.useUtils().threadComments.getThreadComments;

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
        {isCurrentUsersComment && (
          <MenuItem
            onClick={() => {
              handleClose();
              setModalIsOpen(true);
            }}
          >
            <Typography color='error'>Delete</Typography>
          </MenuItem>
        )}
        {!isCurrentUsersComment && (
          <MenuItem
            onClick={() => {
              handleClose();
              handleReport();
            }}
          >
            <Typography color='error'>Report</Typography>
          </MenuItem>
        )}
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
            { id: commentData?.id || '' },
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
      <ReportDialog
        reportedEntity={ReportedEntity.RAP_COMMENT}
        isOpen={reportDialogIsOpen}
        handleClose={() => setReportDialogIsOpen(false)}
        rapCommentData={commentData}
      />
    </Box>
  );
}

export default ThreadCommentMenu;
