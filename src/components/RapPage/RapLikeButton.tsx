import { Box } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import ColoredIconButton from 'src/components/ColoredIconButton';
import { api } from 'src/utils/api';

interface RapLikeButtonProps {
  rapId?: string;
}

function RapLikeButton({ rapId }: RapLikeButtonProps) {
  const router = useRouter();

  // Auth state
  const { data, status } = useSession();
  const currentUserId = data?.user?.id;

  // State
  const [currentUserLikedRap, setCurrentUserLikedRap] = useState<boolean>(false);
  const [rapLikesCount, setRapLikesCount] = useState<number>(0);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Queries
  const { data: likeExists } = api.rapVote.likeExists.useQuery(
    {
      rapId: rapId as string,
      userId: currentUserId as string
    },
    {
      enabled: Boolean(currentUserId && rapId)
    }
  );
  const { data: rapLikesCountData } = api.rapVote.getRapLikesCount.useQuery(
    {
      rapId: rapId as string
    },
    {
      enabled: Boolean(rapId)
    }
  );

  // Sync state with DB
  const syncStateWithDB = () => {
    setCurrentUserLikedRap(likeExists || false);
    setRapLikesCount(rapLikesCountData || 0);
  };

  // Mutations
  const { mutate: createLike } = api.rapVote.createLike.useMutation();
  const { mutate: deleteLike } = api.rapVote.deleteLike.useMutation();

  // Invalidators
  const { invalidate: invalidateRapLikesCount } = api.useContext().rapVote.getRapLikesCount;
  const { invalidate: invalidateLikeExists } = api.useContext().rapVote.likeExists;

  const invalidateCache = () => {
    invalidateRapLikesCount();
    invalidateLikeExists();
  };

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
      createLike(
        {
          rapId: rapId
        },
        {
          onSuccess: () => {
            invalidateCache();
          },
          onError: err => {
            invalidateCache();
            syncStateWithDB();
            toast.error(err.message);
          }
        }
      );
    });
  };

  const handleUnlike = () => {
    if (!currentUserId || !rapId) return;

    setCurrentUserLikedRap(false);
    setRapLikesCount(prevCount => prevCount - 1);

    handleDebouncedAPI(() => {
      deleteLike(
        {
          rapId: rapId
        },
        {
          onSuccess: () => {
            invalidateCache();
          },
          onError: err => {
            invalidateCache();
            syncStateWithDB();
            toast.error(err.message);
          }
        }
      );
    });
  };

  useEffect(() => {
    syncStateWithDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rapLikesCountData, likeExists]);

  useEffect(() => {
    return () => {
      // Clear the timer when the component unmounts to prevent memory leaks
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const buttonClickHandler =
    status === 'unauthenticated'
      ? () => router.push('/auth')
      : currentUserLikedRap
      ? handleUnlike
      : handleLike;

  return (
    <Box display='flex' alignItems='center'>
      <ColoredIconButton
        icon='mdi:heart'
        iconColor='red'
        onClick={buttonClickHandler}
        isColored={currentUserLikedRap}
        sx={{
          paddingRight: 1
        }}
      />
      {rapLikesCount || 0}
    </Box>
  );
}

export default RapLikeButton;
