import { Avatar, Card, Stack, SxProps, Typography } from '@mui/material';
import { User } from '@prisma/client';
import { BUCKET_URL } from 'src/shared/constants';
import RapCardChip from '../RapCardChip';

interface LeaderboardUserCardProps {
  userData: User | null;
  sx?: SxProps;
  userClickHandler?: (userId: string) => void;
}
function LeaderboardUserCard({ userData, sx, userClickHandler }: LeaderboardUserCardProps) {
  const formattedAge = userData?.dob ?? new Date();
  const age = new Date().getFullYear() - new Date(formattedAge).getFullYear();

  const onCardClick = () => {
    const userId = userData?.id;
    if (userClickHandler && userId) {
      userClickHandler(userId);
    }
  };

  return (
    <Card
      sx={{
        px: '2rem',
        py: '1.25rem',
        height: 'fit-content',
        minHeight: '8.5rem',
        ...sx,
        position: 'relative'
      }}
      onClick={userClickHandler ? onCardClick : undefined}
    >
      <Stack direction='row' alignItems='center' height='100%'>
        <Avatar
          alt='Profile avatar */'
          {...(userData?.profileImageUrl && {
            src: `${BUCKET_URL}/${userData.profileImageUrl}`
          })}
          sx={{ width: '6rem', height: '6rem' }}
        />
        <Stack ml='1rem' height='100%' justifyContent='space-between'>
          <Stack>
            <Typography variant='body1' fontSize='1.25rem' fontWeight='bold'>
              {userData?.username}
            </Typography>
            <Typography variant='caption' fontWeight='bold' mt='.25rem' mb='1rem'>
              {userData?.sex === 'male' ? 'M' : 'F'} | {age} |{' '}
              {`${userData?.city}, ${userData?.state}`}
            </Typography>
            <RapCardChip
              size='small'
              label={userData?.region || ''}
              sx={{ width: 'fit-content' }}
            />
          </Stack>
        </Stack>
        <Stack
          direction='row'
          alignItems='center'
          sx={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            right: '3.5rem'
          }}
        >
          <Typography
            color='grey.100'
            sx={{
              fontFamily: 'PressStart2P'
            }}
            fontSize='2.5rem'
          >
            {String(userData?.points)}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

export default LeaderboardUserCard;
