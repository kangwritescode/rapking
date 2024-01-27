import {
  Avatar,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Stack,
  Typography
} from '@mui/material';
import { useRouter } from 'next/router';
import { BUCKET_URL } from 'src/shared/constants';
import { api } from 'src/utils/api';

interface SpotlightCardProps {
  userId: string | null;
}

function SpotlightCard({ userId }: SpotlightCardProps) {
  const router = useRouter();

  const {
    data: userData,
    isLoading,
    fetchStatus
  } = api.user.findById.useQuery({ id: userId ?? '' }, { enabled: !!userId });

  const { data: followersCount } = api.userFollows.getFollowersCount.useQuery(
    { userId: userId ?? '' },
    { enabled: !!userId }
  );

  const { data: userFollowsCount } = api.userFollows.getFollowingCount.useQuery(
    { userId: userData?.id || '' },
    {
      enabled: !!userData?.id
    }
  );
  const { data: userFollowersCount } = api.userFollows.getFollowersCount.useQuery(
    { userId: userData?.id || '' },
    {
      enabled: !!userData?.id
    }
  );

  const { bannerUrl } = userData || {};

  return (
    <Card
      sx={{
        height: 'fit-content',
        minHeight: '18rem',
        width: '18rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        pt: '4rem',
        px: '2.5rem',
        pb: '2rem'
      }}
    >
      <CardMedia
        component='img'
        alt='profile-header'
        image={
          bannerUrl ? `${BUCKET_URL}/${bannerUrl}` : `${BUCKET_URL}/default/profile-banner.jpg`
        }
        sx={{
          height: '7.25rem',
          width: '100%',
          position: 'absolute',
          top: 0
        }}
        onError={e => {
          const target = e.target as HTMLImageElement; // Type assertion
          target.onerror = null; // Prevents looping
          target.src = `${BUCKET_URL}/default/profile-banner.jpg`; // Fallback to a transparent image
        }}
      />
      <Avatar
        sx={{
          height: '7rem',
          width: '7rem',
          mb: '1rem'
        }}
        alt='Profile avatar'
        {...(userData?.profileImageUrl && {
          src: `${BUCKET_URL}/${userData.profileImageUrl}`
        })}
      />
      {fetchStatus !== 'idle' && isLoading ? (
        <CircularProgress
          sx={{
            mt: '1rem',
            color: 'inherit'
          }}
        />
      ) : userData ? (
        <>
          <Typography fontSize='1.25rem' fontWeight='bold' mb='.10rem'>
            {userData?.username}
          </Typography>
          <Typography variant='caption' fontWeight='bold' mb='1.4rem'>
            {userFollowersCount} Followers | {userFollowsCount} Following
          </Typography>
          <Stack direction='row' alignItems='top' justifyContent='center' gap='3rem' mb='.5rem'>
            <Stack alignItems='center'>
              <Typography fontWeight='bold' fontSize='18px' fontFamily='PressStart2P'>
                {userData?.points}
              </Typography>
              <Typography variant='caption'>POINTS</Typography>
            </Stack>
            <Stack alignItems='center'>
              <Typography fontWeight='bold' fontSize='1.4rem' lineHeight='1.55rem' mb='.2rem'>
                {followersCount}
              </Typography>
              <Typography variant='caption'>FOLLOWERS</Typography>
            </Stack>
          </Stack>
          <Stack direction='row'>
            <Button
              sx={{
                mt: '1rem'
              }}
              variant='contained'
              size='small'
              onClick={() => router.push(`/u/${userData?.username}`)}
            >
              View Profile
            </Button>
          </Stack>
        </>
      ) : (
        <Typography
          sx={{
            mt: '1.25rem'
          }}
          variant='body2'
          fontWeight='bold'
          fontSize='1.25rem'
        >
          Select a user
        </Typography>
      )}
    </Card>
  );
}

export default SpotlightCard;
