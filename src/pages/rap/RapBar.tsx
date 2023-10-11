import { Box, IconButton, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
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
  const [commentDrawerIsOpen, setCommentDrawerIsOpen] = useState<boolean>(false);
  const [currentUserLikedRap, setCurrentUserLikedRap] = useState<boolean>(false);
  const [rapLikesCount, setRapLikesCount] = useState<number>(0);

  // Queries
  const { data: currentUser } = api.user.getCurrentUser.useQuery();
  const { data: rapCommentsCount } = api.rapComment.rapCommentsCount.useQuery({ rapId: rapData?.id as string }, {
    enabled: !!rapData?.id
  });
  const { data: rapLikes } = api.vote.getRapLikes.useQuery({ rapId: rapData?.id as string }, {
    enabled: !!rapData?.id
  });

  // Mutations
  const { mutate: createLike, isLoading: createLikeIsLoading } = api.vote.createLike.useMutation();
  const { mutate: deleteLike, isLoading: deleteLikeIsLoading} = api.vote.deleteLike.useMutation();

  // Invalidaters
  const { invalidate: invalidateRapLikes } = api.useContext().vote.getRapLikes;

  // Effects
  useEffect(() => {
    if (currentUser && rapLikes) {
      setCurrentUserLikedRap(rapLikes.some(like => like.userId === currentUser.id))
    }
  }, [currentUser, rapLikes])

  useEffect(() => {
    if (rapData?.likesCount) {
      setRapLikesCount(rapData?.likesCount || 0);
    }
  }, [rapData?.likesCount])

  const likeRap = () => {
    if (currentUser && rapData && currentUser) {
      setRapLikesCount(rapLikesCount + 1);
      setCurrentUserLikedRap(true)
      createLike({
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

  const unlikeRap = () => {
    if (currentUser && rapData && currentUser) {
      setRapLikesCount(rapLikesCount - 1);
      setCurrentUserLikedRap(false)
      deleteLike({
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
              paddingRight: 1,
            }}
            onClick={currentUserLikedRap ? unlikeRap : likeRap}
            disabled={createLikeIsLoading || deleteLikeIsLoading}
          >
            <Icon
              {...(currentUserLikedRap ? { color: 'orange' } : {})}
              icon='mdi:fire'
            />
          </IconButton>
          {rapLikesCount || 0}
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
