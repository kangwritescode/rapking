import { Box, SxProps } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import ColoredIconButton from 'src/components/ColoredIconButton';
import { api } from 'src/utils/api';

interface CommentLikeButtonProps {
  threadCommentId?: string;
  sx?: SxProps;
}

function CommentLikeButton({ threadCommentId, sx }: CommentLikeButtonProps) {
  const { data, status } = useSession();
  const currentUserId = data?.user?.id;

  // State
  const [currentUserLikedThreadComment, setCurrentUserLikedThreadComment] =
    useState<boolean>(false);
  const [threadCommentLikesCount, setThreadCommentLikesCount] = useState<number>(0);

  const syncStateWithDB = () => {
    setCurrentUserLikedThreadComment(likeExists || false);
    setThreadCommentLikesCount(commentLikesCount || 0);
  };

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Queries
  const { data: commentLikesCount, refetch: refetchCommentLikesCount } =
    api.commentVote.getCommentLikesCount.useQuery(
      {
        commentId: threadCommentId as string
      },
      {
        enabled: Boolean(threadCommentId),
        refetchOnMount: false,
        refetchOnWindowFocus: false
      }
    );

  const { data: likeExists, refetch: refetchLikeExists } = api.commentVote.likeExists.useQuery(
    {
      commentId: threadCommentId as string,
      userId: currentUserId as string
    },
    {
      enabled: Boolean(currentUserId && threadCommentId),
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
    if (!currentUserId || !threadCommentId) return;

    setCurrentUserLikedThreadComment(true);
    setThreadCommentLikesCount(prevCount => prevCount + 1);
    handleDebouncedAPI(() => {
      createLike({
        commentId: threadCommentId,
        userId: currentUserId
      })
        .then(() => {
          refetch();
        })
        .catch(err => {
          syncStateWithDB();
          toast.error(err.message);
        });
    });
  };

  const handleUnlike = () => {
    if (status === 'unauthenticated') {
      return toast.error('You must be logged in to like a comment.');
    }
    if (!threadCommentId || !currentUserId) return;

    setCurrentUserLikedThreadComment(false);
    setThreadCommentLikesCount(prevCount => prevCount - 1);

    handleDebouncedAPI(() => {
      deleteLike({
        commentId: threadCommentId,
        userId: currentUserId
      })
        .then(() => {
          refetch();
        })
        .catch(err => {
          syncStateWithDB();
          toast.error(err.message);
        });
    });
  };

  useEffect(() => {
    syncStateWithDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [likeExists, commentLikesCount]);

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
      <ColoredIconButton
        icon='mdi:heart'
        iconColor='red'
        onClick={currentUserLikedThreadComment ? handleUnlike : handleLike}
        isColored={currentUserLikedThreadComment}
        sx={{
          py: 0,
          pl: 0,
          paddingRight: 1
        }}
      />
      {threadCommentLikesCount || 0}
    </Box>
  );
}

export default CommentLikeButton;
