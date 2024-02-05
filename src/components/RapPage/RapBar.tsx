import { Icon } from '@iconify/react';
import { Box, IconButton, SxProps, useTheme } from '@mui/material';
import { Rap, User } from '@prisma/client';
import { useState } from 'react';
import RapCommentDrawer from 'src/components/RapPage/RapCommentDrawer';
import { api } from 'src/utils/api';
import RapLikeButton from './RapLikeButton';

interface RapBarProps {
  rapData?:
    | (Rap & {
        user?: Partial<User>;
      })
    | null;
  commentClickHandler?: () => void;
  sx?: SxProps;
  defaultCommentDrawerIsOpen?: boolean;
}

function RapBar({ rapData, commentClickHandler, sx, defaultCommentDrawerIsOpen }: RapBarProps) {
  const theme = useTheme();

  // Queries
  const { data: rapCommentsCount } = api.threadComments.getThreadCommentsCount.useQuery(
    {
      rapId: rapData?.id as string
    },
    {
      enabled: !!rapData?.id
    }
  );

  // State
  const [commentDrawerIsOpen, setCommentDrawerIsOpen] = useState<boolean>(
    Boolean(defaultCommentDrawerIsOpen)
  );

  return (
    <>
      <RapCommentDrawer
        isOpen={commentDrawerIsOpen}
        onCloseHandler={() => setCommentDrawerIsOpen(false)}
        rapId={rapData?.id as string}
      />
      <Box display='flex' sx={sx}>
        <RapLikeButton rapId={rapData?.id} />
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
