import { Icon } from '@iconify/react';
import { Box, IconButton, SxProps, useTheme } from '@mui/material';
import { Rap, User } from '@prisma/client';
import { useState } from 'react';
import { api } from 'src/utils/api';
import RapLikeButton from './RapLikeButton';
import ReviewDrawer from './ReviewDrawer';
import ReviewWithRatingButton from './ReviewWithRatingButton';
import ThreadDrawer from './ThreadDrawer';

interface RapBarProps {
  rapData?:
    | (Rap & {
        user?: Partial<User>;
      })
    | null;
  commentClickHandler?: () => void;
  sx?: SxProps;
  defaultCommentDrawerIsOpen?: boolean;
  threadId?: string | null;
}

function RapBar({
  rapData,
  commentClickHandler,
  sx,
  defaultCommentDrawerIsOpen,
  threadId
}: RapBarProps) {
  const theme = useTheme();

  // Queries
  const { data: rapCommentsCount } = api.threadComments.getThreadCommentsCount.useQuery(
    {
      id: threadId as string
    },
    {
      enabled: !!threadId
    }
  );

  // State
  const [commentDrawerIsOpen, setCommentDrawerIsOpen] = useState<boolean>(
    Boolean(defaultCommentDrawerIsOpen)
  );
  const [reviewDrawerIsOpen, setReviewDrawerIsOpen] = useState<boolean>(false);

  return (
    <>
      <ThreadDrawer
        isOpen={commentDrawerIsOpen}
        onCloseHandler={() => setCommentDrawerIsOpen(false)}
        threadId={threadId}
      />
      <ReviewDrawer
        isOpen={reviewDrawerIsOpen}
        onCloseHandler={() => setReviewDrawerIsOpen(false)}
        rapData={rapData}
      />

      <Box display='flex' sx={sx}>
        <RapLikeButton rapId={rapData?.id} />
        <ReviewWithRatingButton rapId={rapData?.id} onClick={() => setReviewDrawerIsOpen(true)} />
        <Box
          sx={{
            ml: theme.spacing(5),
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <IconButton
            onClick={commentClickHandler ? commentClickHandler : () => setCommentDrawerIsOpen(true)}
            sx={{
              pr: 1
            }}
            disabled={rapData?.disableComments}
          >
            <Icon icon='prime:comment' />
          </IconButton>
          {rapCommentsCount || 0}
        </Box>
      </Box>
    </>
  );
}

export default RapBar;
