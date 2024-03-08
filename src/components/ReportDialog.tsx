import { Icon } from '@iconify/react';
import { IconButton, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Rap, ReportedEntity, ThreadComment, User } from '@prisma/client';
import ReportMaker from './ReportMaker';

interface ReportDialogProps {
  isOpen: boolean;
  handleClose: () => void;
  reportedEntity: ReportedEntity;
  rapData?: (Rap & { user?: Partial<User> }) | null;
  commentData?: ThreadComment | null;
  forumThreadId?: string;
}

function ReportDialog({
  isOpen,
  handleClose,
  reportedEntity,
  rapData,
  commentData,
  forumThreadId
}: ReportDialogProps) {
  let dialogTitle = 'Report ';
  if (reportedEntity === ReportedEntity.RAP) {
    dialogTitle = dialogTitle + 'Rap';
  } else if (reportedEntity === ReportedEntity.RAP_COMMENT) {
    dialogTitle = dialogTitle + 'Rap Comment';
  } else if (reportedEntity === ReportedEntity.FORUM_COMMENT) {
    dialogTitle = dialogTitle + 'Forum Comment';
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth={false}
      sx={{
        width: '100%'
      }}
    >
      <IconButton
        onClick={handleClose}
        sx={theme => ({
          position: 'absolute',
          right: theme.spacing(2),
          top: theme.spacing(2)
        })}
      >
        <Icon icon='ph:x' />
      </IconButton>
      <DialogTitle>
        <Typography fontSize='1rem' variant='button'>
          {dialogTitle}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          width: {
            xs: '100%',
            sm: '30rem',
            md: '36rem'
          }
        }}
      >
        <ReportMaker
          cancelButtonHandler={handleClose}
          onSuccessfulReport={handleClose}
          reportedEntity={reportedEntity}
          rapData={rapData}
          commentData={commentData}
          forumThreadId={forumThreadId}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ReportDialog;
