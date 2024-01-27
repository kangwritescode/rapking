import { Icon } from '@iconify/react';
import { Box, IconButton, useTheme } from '@mui/material';
import { Rap, User } from '@prisma/client';
import { useRouter } from 'next/router';
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
}

function RapBar({ rapData }: RapBarProps) {
  const theme = useTheme();
  const { commentId } = useRouter().query;

  // Queries
  const { data: rapCommentsCount } = api.rapComment.getRapCommentsCount.useQuery(
    {
      rapId: rapData?.id as string
    },
    {
      enabled: !!rapData?.id
    }
  );

  // State
  const [commentDrawerIsOpen, setCommentDrawerIsOpen] = useState<boolean>(!!commentId);

  return (
    <>
      <RapCommentDrawer
        isOpen={commentDrawerIsOpen}
        onCloseHandler={() => setCommentDrawerIsOpen(false)}
        rapId={rapData?.id as string}
      />
      <Box display='flex'>
        <RapLikeButton rapId={rapData?.id} />
        <Box
          sx={{
            ml: theme.spacing(5),
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <IconButton
            onClick={() => setCommentDrawerIsOpen(true)}
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
