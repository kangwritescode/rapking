import { Box, SxProps } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import FireIconButton from 'src/components/FireIconButton';
import { api } from 'src/utils/api';

interface CommentLikeButtonProps {
  rapCommentId?: string;
  sx?: SxProps;
}

function CommentLikeButton({ rapCommentId, sx }: CommentLikeButtonProps) {
  const { data, status } = useSession();
  const currentUserId = data?.user?.id;

  // State
  const [currentUserLikedRapComment, setCurrentUserLikedRapComment] = useState<boolean>(false);
  const [rapCommentLikesCount, setRapCommentLikesCount] = useState<number>(0);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Queries
  const { data: commentLikesCount, refetch: refetchCommentLikesCount } = api.commentVote.getCommentLikesCount.useQuery(
    {
      commentId: rapCommentId as string
    },
    {
      enabled: Boolean(rapCommentId),
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  );

  const { data: likeExists, refetch: refetchLikeExists } = api.commentVote.likeExists.useQuery(
    {
      commentId: rapCommentId as string,
      userId: currentUserId as string
    },
    {
      enabled: Boolean(currentUserId && rapCommentId),
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  );

  const refetch = () => {
    refetchCommentLikesCount();
    refetchLikeExists();
  };

  // Mutations
  const { mutateAsync: createLike } = api.commentVote.createLike.useMutation();
  const { mutateAsync: deleteLike } = api.commentVote.deleteVote.useMutation();

  // A utility to debounce API calls and handle cache invalidation.
  const handleDebouncedAPI = (action: () => void) => {
    clearTimeout(debounceTimer.current as NodeJS.Timeout);
    debounceTimer.current = setTimeout(() => {
      action();
    }, 300);
  };

  const handleLike = () => {
    if (status === 'unauthenticated') {
      return toast.error('You must be logged in to like a comment.');
    }
    if (!currentUserId || !rapCommentId) return;

    setCurrentUserLikedRapComment(true);
    setRapCommentLikesCount(prevCount => prevCount + 1);
    handleDebouncedAPI(() => {
      createLike({
        commentId: rapCommentId,
        userId: currentUserId
      })
        .then(() => {
          refetch();
        })
        .catch(() => {
          refetch();
        });
    });
  };

  const handleUnlike = () => {
    if (status === 'unauthenticated') {
      return toast.error('You must be logged in to like a comment.');
    }
    if (!rapCommentId || !currentUserId) return;

    setCurrentUserLikedRapComment(false);
    setRapCommentLikesCount(prevCount => prevCount - 1);

    handleDebouncedAPI(() => {
      deleteLike({
        commentId: rapCommentId,
        userId: currentUserId
      })
        .then(() => {
          refetch();
        })
        .catch(() => {
          refetch();
        });
    });
  };

  useEffect(() => {
    setCurrentUserLikedRapComment(likeExists || false);
  }, [likeExists]);

  useEffect(() => {
    if (commentLikesCount) {
      setRapCommentLikesCount(commentLikesCount || 0);
    }
  }, [commentLikesCount]);

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
      display='flex'
      alignItems='center'
      sx={{
        ...sx
      }}
    >
      <FireIconButton
        onClick={currentUserLikedRapComment ? handleUnlike : handleLike}
        isColored={currentUserLikedRapComment}
        sx={{
          paddingRight: 1,
          py: 0,
          pl: 0
        }}
      />
      {rapCommentLikesCount || 0}
    </Box>
  );
}

export default CommentLikeButton;
