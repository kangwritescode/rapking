import { Box } from '@mui/material';
import { Rap, User } from '@prisma/client';
import React, { useEffect, useRef, useState } from 'react'
import FireIconButton from 'src/components/FireIconButton';
import { api } from 'src/utils/api';

interface RapLikeButtonProps {
  rapData?: (Rap & {
    user?: User;
  }) | null;
}

function RapLikeButton({ rapData }: RapLikeButtonProps) {

  // State
  const [currentUserLikedRap, setCurrentUserLikedRap] = useState<boolean>(false);
  const [rapLikesCount, setRapLikesCount] = useState<number>(0);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Queries
  const { data: currentUser } = api.user.getCurrentUser.useQuery();
  const { data: likeExists } = api.rapVote.likeExists.useQuery({
    rapId: rapData?.id as string,
    userId: currentUser?.id as string,
  }, {
    enabled: Boolean(currentUser?.id && rapData?.id)
  });

  // Mutations
  const { mutate: createLike } = api.rapVote.createLike.useMutation();
  const { mutate: deleteLike } = api.rapVote.deleteLike.useMutation();

  // Invalidators
  const { invalidate: invalidateRap } = api.useContext().rap.getRap;
  const { invalidate: invalidateLikeExists } = api.useContext().rapVote.likeExists;

  const invalidateCache = () => {
    invalidateRap();
    invalidateLikeExists();
  }

  // A utility to debounce API calls and handle cache invalidation.
  const handleDebouncedAPI = (action: () => void) => {
    clearTimeout(debounceTimer.current as NodeJS.Timeout);
    debounceTimer.current = setTimeout(() => {
      action();
    }, 1000);
  };

  const handleLike = () => {
    if (!currentUser?.id || !rapData?.id) return;

    setCurrentUserLikedRap(true);
    setRapLikesCount(prevCount => prevCount + 1);
    handleDebouncedAPI(() => {
      createLike({
        rapId: rapData.id,
        userId: currentUser.id,
        authorId: rapData.user?.id as string,
      }, {
        onError: () => {
          invalidateCache()
        }
      })
    })
  };

  const handleUnlike = () => {
    if (!currentUser?.id || !rapData?.id) return;

    setCurrentUserLikedRap(false);
    setRapLikesCount(prevCount => prevCount - 1);

    handleDebouncedAPI(() => {
      deleteLike({
        rapId: rapData.id,
        userId: currentUser.id,
        authorId: rapData.user?.id as string,
      }, {
        onError: () => {
          invalidateCache()
        }
      });
    })
  };

  useEffect(() => {
    setCurrentUserLikedRap(likeExists || false)
  }, [likeExists])

  useEffect(() => {
    if (rapData?.likesCount) {
      setRapLikesCount(rapData?.likesCount || 0);
    }
  }, [rapData?.likesCount])

  useEffect(() => {
    return () => {
      // Clear the timer when the component unmounts to prevent memory leaks
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <Box
      display="flex"
      alignItems="center">
      <FireIconButton
        onClick={currentUserLikedRap ? handleUnlike : handleLike}
        isColored={currentUserLikedRap}
      />
      {rapLikesCount || 0}
    </Box>
  )
}

export default RapLikeButton
