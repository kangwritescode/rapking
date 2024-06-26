import {
  Avatar,
  Card,
  Stack,
  SxProps,
  Theme,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { User } from '@prisma/client';
import { useRouter } from 'next/router';
import { BUCKET_URL } from 'src/shared/constants';

interface LeaderboardUserCardProps {
  userData: Partial<User> | null;
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
  const router = useRouter();

  const isMobileView = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const onCardClick = () => {
    const userId = userData?.id;
    if (userClickHandler && userId && !isMobileView) {
      userClickHandler(userId);
    } else {
      router.push(`/u/${userData?.username}`);
    }
  };

  const backgroundColor =
    place === 1 ? '#9d8600' : place === 2 ? '#9d9d9d' : place === 3 ? '#764d24fc' : 'grey.800';
  const placeIsEven = place % 2 === 0;

  return (
    <Card
      sx={{
        px: {
          xs: '1rem',
          md: '2rem'
        },
        py: '1.75rem',
        height: '3.5rem',
        position: 'relative',
        backgroundColor: placeIsEven ? '#333333' : '#262626',
        outline: selected ? `2px solid ${theme.palette.grey[500]}` : 'none',
        '&:hover': {
          cursor: 'pointer',
          backgroundColor: placeIsEven ? '#444444' : '#333333'
        },
        ...sx
      }}
      onClick={onCardClick}
    >
      <Stack direction='row' alignItems='center' height='100%'>
        <Stack
          alignItems='center'
          justifyContent='center'
          mr={{
            xs: '1rem',
            md: '1.5rem'
          }}
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
            right: {
              xs: '1.5rem',
              md: '3.5rem'
            }
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
