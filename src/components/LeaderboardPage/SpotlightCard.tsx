import { Avatar, Button, Card, CardMedia, Stack, Typography } from '@mui/material';
import { BUCKET_URL } from 'src/shared/constants';
import { api } from 'src/utils/api';

interface SpotlightCardProps {
  userId: string | null;
}

function SpotlightCard({ userId }: SpotlightCardProps) {
  const { data: userData } = api.user.findById.useQuery(
    { id: userId ?? '' },
    { enabled: !!userId }
  );

  const { bannerUrl } = userData || {};

  const formattedAge = userData?.dob ?? new Date();
  const age = new Date().getFullYear() - new Date(formattedAge).getFullYear();

  return (
    <Card
      sx={{
        height: 'fit-content',
        width: '20rem',
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
      <Typography fontSize='1.25rem' fontWeight='bold' mb='.10rem'>
        {userData?.username}
      </Typography>
      <Typography variant='caption' fontWeight='bold' mb='1.4rem'>
        {userData?.sex === 'male' ? 'M' : 'F'} | {age} | {`${userData?.city}, ${userData?.state}`}
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
            26
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
        >
          View Profile
        </Button>
      </Stack>
    </Card>
  );
}

export default SpotlightCard;
