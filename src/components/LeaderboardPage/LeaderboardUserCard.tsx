import { Avatar, Card, Stack, SxProps, Typography, useTheme } from '@mui/material';
import { User } from '@prisma/client';
import { BUCKET_URL } from 'src/shared/constants';

interface LeaderboardUserCardProps {
  userData: User | null;
  sx?: SxProps;
  userClickHandler?: (userId: string) => void;
  place: number;
  selected: boolean;
}
function LeaderboardUserCard({
  userData,
  sx,
  userClickHandler,
  place,
  selected
}: LeaderboardUserCardProps) {
  const theme = useTheme();

  const onCardClick = () => {
    const userId = userData?.id;
    if (userClickHandler && userId) {
      userClickHandler(userId);
    }
  };

  const backgroundColor =
    place === 1 ? '#9d8600' : place === 2 ? '#9d9d9d' : place === 3 ? '#764d24fc' : 'grey.800';
  const placeIsEven = place % 2 === 0;

  return (
    <Card
      sx={{
        px: '2rem',
        py: '1.75rem',
        height: 'fit-content',
        position: 'relative',
        backgroundColor: placeIsEven ? '#333333' : '#262626',
        outline: selected ? `2px solid ${theme.palette.grey[500]}` : 'none',
        '&:hover': {
          cursor: 'pointer',
          backgroundColor: placeIsEven ? '#444444' : '#333333'
        },
        ...sx
      }}
      onClick={userClickHandler ? onCardClick : undefined}
    >
      <Stack direction='row' alignItems='center' height='100%'>
        <Stack
          alignItems='center'
          justifyContent='center'
          mr='1.5rem'
          sx={{
            borderRadius: '50%',
            backgroundColor,
            width: '1.75rem',
            height: '1.75rem'
          }}
        >
          <Typography
            sx={{
              fontSize: '1rem'
            }}
          >
            {String(place)}
          </Typography>
        </Stack>
        <Avatar
          alt='Profile avatar'
          {...(userData?.profileImageUrl && {
            src: `${BUCKET_URL}/${userData.profileImageUrl}`
          })}
          sx={{ width: '2.5rem', height: '2.5rem' }}
        />
        <Typography variant='body1' fontSize='1.25rem' fontWeight='bold' ml='1rem'>
          {userData?.username}
        </Typography>
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
            fontSize='1.5rem'
          >
            {String(userData?.points)}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

export default LeaderboardUserCard;
