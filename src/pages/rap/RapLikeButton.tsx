import { Box } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react'
import FireIconButton from 'src/components/FireIconButton';
import { api } from 'src/utils/api';

interface RapLikeButtonProps {
  rapId?: string;
}

function RapLikeButton({ rapId }: RapLikeButtonProps) {
  // Auth state
  const { data } = useSession();
  const currentUserId = data?.user?.id;

  // State
  const [currentUserLikedRap, setCurrentUserLikedRap] = useState<boolean>(false);
  const [rapLikesCount, setRapLikesCount] = useState<number>(0);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Queries
  const { data: likeExists } = api.rapVote.likeExists.useQuery({
    rapId: rapId as string,
    userId: currentUserId as string,
  }, {
    enabled: Boolean(currentUserId && rapId)
  });
  const { data: rapLikesCountData } = api.rapVote.getRapLikesCount.useQuery({
    rapId: rapId as string,
  }, {
    enabled: Boolean(rapId)
  });

  // Mutations
  const { mutate: createLike } = api.rapVote.createLike.useMutation();
  const { mutate: deleteLike } = api.rapVote.deleteLike.useMutation();

  // Invalidators
  const { invalidate: invalidateRapLikesCount } = api.useContext().rapVote.getRapLikesCount;
  const { invalidate: invalidateLikeExists } = api.useContext().rapVote.likeExists;

  const invalidateCache = () => {
    invalidateRapLikesCount();
    invalidateLikeExists();
  }

  // A utility to debounce API calls and handle cache invalidation.
  const handleDebouncedAPI = (action: () => void) => {
    clearTimeout(debounceTimer.current as NodeJS.Timeout);
    debounceTimer.current = setTimeout(() => {
      action();
    }, 300);
  };

  const handleLike = () => {
    if (!currentUserId || !rapId) return;

    setCurrentUserLikedRap(true);
    setRapLikesCount(prevCount => prevCount + 1);
    handleDebouncedAPI(() => {
      createLike({
        rapId: rapId,
        userId: currentUserId,
      }, {
        onSuccess: () => {
          invalidateCache()
        },
        onError: () => {
          invalidateCache()
        }
      })
    })
  };

  const handleUnlike = () => {
    if (!currentUserId || !rapId) return;

    setCurrentUserLikedRap(false);
    setRapLikesCount(prevCount => prevCount - 1);

    handleDebouncedAPI(() => {
      deleteLike({
        rapId: rapId,
        userId: currentUserId,
      }, {
        onSuccess: () => {
          invalidateCache()
        },
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
      setRapLikesCount(rapLikesCountData || 0);
  }, [rapLikesCountData])

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