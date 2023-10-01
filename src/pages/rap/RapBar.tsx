import { Box, IconButton, useTheme } from '@mui/material'
import React from 'react'
import { Icon } from '@iconify/react'
import { Rap, User } from '@prisma/client'
import { api } from 'src/utils/api'
import RapCommentDrawer from 'src/components/RapCommentDrawer'

interface RapBarProps {
  rapData?: (Rap & {
    user?: User;
  }) | null;
}

function RapBar({ rapData }: RapBarProps) {

  const theme = useTheme();

  // State
  const [commentDrawerIsOpen, setCommentDrawerIsOpen] = React.useState<boolean>(false);

  // Queries
  const { data: currentUser } = api.user.getCurrentUser.useQuery();
  const { data: rapLikes } = api.vote.getRapLikes.useQuery({ rapId: rapData?.id as string }, {
    enabled: !!rapData?.id
  });
  const { data: rapCommentsCount } = api.rapComment.rapCommentsCount.useQuery({ rapId: rapData?.id as string }, {
    enabled: !!rapData?.id
  });

  // Mutations
  const { mutate: createVote } = api.vote.createRapVote.useMutation();
  const { mutate: deleteVote } = api.vote.deleteRapVoteByUser.useMutation();

  // Invalidaters
  const { invalidate: invalidateRapLikes } = api.useContext().vote.getRapLikes;

  // Like Logic

  let currentUserLikedRap = false;
  if (currentUser) {
    currentUserLikedRap = !!rapLikes?.find(vote => vote.userId === currentUser.id && vote.type === 'LIKE');
  }

  const likeRap = () => {
    if (currentUser && rapData && currentUser) {
      createVote({
        rapId: rapData?.id as string,
        userId: currentUser.id,
        type: 'LIKE'
      }, {
        onSuccess: () => {
          invalidateRapLikes(
            {
              rapId: rapData?.id as string,
            },
          )
        }
      })
    }
  }

  const unlikeRap = () => {
    if (currentUser && rapData && currentUser) {
      deleteVote({
        rapId: rapData?.id as string,
        userId: currentUser.id,
      }, {
        onSuccess: () => {
          invalidateRapLikes(
            {
              rapId: rapData?.id as string,
            },
          )
        }
      })
    }
  }

  return (
    <>
      <RapCommentDrawer
        isOpen={commentDrawerIsOpen}
        onCloseHandler={() => setCommentDrawerIsOpen(false)}
        rapId={rapData?.id as string}
      />
      <Box display="flex">
        <Box
          display="flex"
          alignItems="center">
          <IconButton
            sx={{
              paddingRight: 1
            }}
            onClick={currentUserLikedRap ? unlikeRap : likeRap}
          >
            <Icon
              {...(currentUserLikedRap ? { color: 'orange' } : {})}
              icon='mdi:fire'
            />
          </IconButton>
          {rapLikes?.length || 0}
        </Box>
        <Box sx={{
          ml: theme.spacing(5),
          display: 'flex',
          alignItems: 'center'
        }}>
          <IconButton
            onClick={() => setCommentDrawerIsOpen(true)}
            sx={{
              pr: 1
            }}>
            <Icon icon='prime:comment' />
          </IconButton>
          {rapCommentsCount || 0}
        </Box>
      </Box>
    </>
  )
}

export default RapBar