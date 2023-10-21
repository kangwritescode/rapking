import { Box, SxProps } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react'
import FireIconButton from 'src/components/FireIconButton';
import { api } from 'src/utils/api';

interface CommentLikeButtonProps {
  rapCommentId?: string;
  sx?: SxProps;
}

function CommentLikeButton({ rapCommentId, sx }: CommentLikeButtonProps) {

  const { data } = useSession()
  const currentUserId = data?.user?.id;

  // State
  const [currentUserLikedRapComment, setCurrentUserLikedRapComment] = useState<boolean>(false);
  const [rapCommentLikesCount, setRapCommentLikesCount] = useState<number>(0);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Queries
  const { data: commentLikesCount } = api.commentVote.getCommentLikesCount.useQuery({
    commentId: rapCommentId as string,
  }, {
    enabled: Boolean(rapCommentId)
  });
  const { data: likeExists } = api.commentVote.likeExists.useQuery({
    commentId: rapCommentId as string,
    userId: currentUserId as string,
  }, {
    enabled: Boolean(currentUserId && rapCommentId)
  });

  // Mutations
  const { mutate: createLike } = api.commentVote.createLike.useMutation();
  const { mutate: deleteLike } = api.commentVote.deleteVote.useMutation();

  // Invalidators
  const { invalidate: invalidateLikesCount } = api.useContext().commentVote.getCommentLikesCount;
  const { invalidate: invalidateLikeExists } = api.useContext().commentVote.likeExists;

  const invalidateCache = () => {
    invalidateLikesCount();
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
    if (!currentUserId || !rapCommentId) return;

    setCurrentUserLikedRapComment(true);
    setRapCommentLikesCount(prevCount => prevCount + 1);
    handleDebouncedAPI(() => {
      createLike({
        commentId: rapCommentId,
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
    if (!currentUserId || !rapCommentId) return;

    setCurrentUserLikedRapComment(false);
    setRapCommentLikesCount(prevCount => prevCount - 1);

    handleDebouncedAPI(() => {
      deleteLike({
        commentId: rapCommentId,
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
    setCurrentUserLikedRapComment(likeExists || false)
  }, [likeExists])

  useEffect(() => {
    if (commentLikesCount) {
      setRapCommentLikesCount(commentLikesCount || 0);
    }
  }, [commentLikesCount])

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
      alignItems="center"
      sx={{
        ...sx
      }}>
      <FireIconButton
        onClick={currentUserLikedRapComment ? handleUnlike : handleLike}
        isColored={currentUserLikedRapComment}
        sx={{
          paddingRight: 1,
          py: 0,
          pl: 0,
        }}
      />
      {rapCommentLikesCount || 0}
    </Box>
  )
}

export default CommentLikeButton
