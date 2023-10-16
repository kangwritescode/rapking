import { Box, SxProps } from '@mui/material';
import { RapComment, User } from '@prisma/client';
import React, { useEffect, useRef, useState } from 'react'
import FireIconButton from 'src/components/FireIconButton';
import { api } from 'src/utils/api';

interface CommentLikeButtonProps {
  rapCommentData?: (RapComment & {
    user?: User;
  }) | null;
  sx?: SxProps;
}

function CommentLikeButton({ rapCommentData, sx }: CommentLikeButtonProps) {

  // State
  const [currentUserLikedRapComment, setCurrentUserLikedRapComment] = useState<boolean>(false);
  const [rapCommentLikesCount, setRapCommentLikesCount] = useState<number>(0);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Queries
  const { data: currentUser } = api.user.getCurrentUser.useQuery();
  const { data: likeExists } = api.commentVote.likeExists.useQuery({
    commentId: rapCommentData?.id as string,
    userId: currentUser?.id as string,
  }, {
    enabled: Boolean(currentUser?.id && rapCommentData?.id)
  });

  // Mutations
  const { mutate: createLike } = api.commentVote.createLike.useMutation();
  const { mutate: deleteLike } = api.commentVote.deleteVote.useMutation();

  // Invalidators
  const { invalidate: invalidateRapComments } = api.useContext().rapComment.getRapComments;
  const { invalidate: invalidateLikeExists } = api.useContext().commentVote.likeExists;

  const invalidateCache = () => {
    invalidateRapComments();
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
    if (!currentUser?.id || !rapCommentData?.id) return;

    setCurrentUserLikedRapComment(true);
    setRapCommentLikesCount(prevCount => prevCount + 1);
    handleDebouncedAPI(() => {
      createLike({
        commentId: rapCommentData.id,
        userId: currentUser.id,
      }, {
        onError: () => {
          invalidateCache()
        }
      })
    })
  };

  const handleUnlike = () => {
    if (!currentUser?.id || !rapCommentData?.id) return;

    setCurrentUserLikedRapComment(false);
    setRapCommentLikesCount(prevCount => prevCount - 1);

    handleDebouncedAPI(() => {
      deleteLike({
        commentId: rapCommentData.id,
        userId: currentUser.id,
      }, {
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
    if (rapCommentData?.likesCount) {
      setRapCommentLikesCount(rapCommentData?.likesCount || 0);
    }
  }, [rapCommentData?.likesCount])

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
