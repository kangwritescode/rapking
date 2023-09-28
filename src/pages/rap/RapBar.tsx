import { Box, IconButton, useTheme } from '@mui/material'
import React from 'react'
import { Icon } from '@iconify/react'
import { Rap, RapComment, RapVote, User } from '@prisma/client'
import { api } from 'src/utils/api'
import RapCommentDrawer from 'src/components/RapCommentDrawer'

interface RapBarProps {
  rapData?: (Rap & {
    User: User;
    votes: RapVote[];
    comments: RapComment[];
  }) | null;
}

function RapBar({ rapData }: RapBarProps) {

  const { votes, comments } = rapData || {};

  const theme = useTheme();

  // State
  const [commentDrawerIsOpen, setCommentDrawerIsOpen] = React.useState<boolean>(false);

  // Queries
  const { data: currentUser } = api.user.getCurrentUser.useQuery();

  // Mutations
  const { mutate: createVote } = api.vote.createRapVote.useMutation();
  const { mutate: deleteVote } = api.vote.deleteRapVoteByUser.useMutation();

  // Invalidaters
  const { invalidate: invalidateRapQuery } = api.useContext().rap.getRap;

  // Like Logic
  const likes = votes?.filter(vote => vote.type === 'LIKE');
  let currentUserLikedRap = false;
  if (currentUser) {
    currentUserLikedRap = !!votes?.find(vote => vote.userId === currentUser.id && vote.type === 'LIKE');
  }

  const likeRap = () => {
    if (currentUser && rapData && currentUser) {
      createVote({
        rapId: rapData?.id as string,
        userId: currentUser.id,
        type: 'LIKE'
      }, {
        onSuccess: () => {
          invalidateRapQuery(
            {
              id: rapData?.id as string,
              withUser: true, withComments: true, withLikes: true
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
          invalidateRapQuery(
            {
              id: rapData?.id as string,
              withUser: true, withComments: true, withLikes: true
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
        rapComments={comments}
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
          {likes?.length || 0}
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
          {comments?.length || 0}
        </Box>
      </Box>
    </>
  )
}

export default RapBar
