import { Avatar, Box, CardMedia, Stack, SxProps, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Rap, User } from '@prisma/client';
import dayjs from 'dayjs';
import { convert } from 'html-to-text';
import { useRouter } from 'next/router';
import { BUCKET_URL } from 'src/shared/constants';
import RapCardMenu from './UserPage/RapCardMenu';

interface RapCardProps {
  rap: Rap & { user: User };
  sx?: SxProps;
  hideAvatar?: boolean;
  hideUsername?: boolean;
  showMenu?: boolean;
}

function formatDate(dateObj: Date) {
  const date = dayjs(dateObj);
  const currentYear = dayjs().year();

  if (date.year() === currentYear) {
    return date.format('MMM D');
  } else {
    return date.format('MMM D, YYYY');
  }
}

function RapCard({ rap, sx, hideAvatar, hideUsername, showMenu }: RapCardProps) {
  const { id, title, dateCreated, coverArtUrl, content, user: userData } = rap;

  const theme = useTheme();
  const router = useRouter();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumView = useMediaQuery(theme.breakpoints.down('md'));

  const navigateToProfile = () => {
    router.push(`/u/${userData?.username}`);
  };

  const navigateToRap = () => {
    router.push(`/rap/${id}`);
  };

  let formattedContent = convert(content);
  const maxLength = isMobileView ? 50 : isMediumView ? 100 : 160;

  if (formattedContent.length > maxLength) {
    formattedContent = `${formattedContent.slice(0, maxLength)}...`;
  }

  return (
    <Box position='relative' sx={sx}>
      <Stack direction='row' alignItems='center' pb={theme.spacing(2)}>
        {!hideAvatar && (
          <Avatar
            onClick={navigateToProfile}
            {...(userData?.profileImageUrl && {
              src: `${BUCKET_URL}/${userData.profileImageUrl}`
            })}
            alt='profile-picture'
            sx={{
              width: 24,
              height: 24,
              cursor: 'pointer',
              marginRight: theme.spacing(2),
              position: 'relative'
            }}
          />
        )}
        {!hideUsername && (
          <Typography fontSize='.875rem' onClick={navigateToProfile} sx={{ cursor: 'pointer' }}>
            {' '}
            {userData?.username}&nbsp;·&nbsp;{' '}
          </Typography>
        )}
        <Typography
          fontSize='.875rem'
          onClick={navigateToRap}
          sx={{
            cursor: 'pointer'
          }}
        >
          {formatDate(dateCreated)}
        </Typography>
      </Stack>
      <Stack direction='row' justifyContent='space-between'>
        <Box
          pr={theme.spacing(12)}
          sx={{
            wordBreak: 'keep-all'
          }}
          width='100%'
        >
          <Typography
            fontSize='1.25rem'
            fontWeight='bold'
            onClick={navigateToRap}
            sx={{
              cursor: 'pointer'
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              cursor: 'pointer'
            }}
            onClick={navigateToRap}
          >
            {formattedContent}
          </Typography>
          <Stack direction='row' justifyContent='end'>
            {showMenu && <RapCardMenu rapId={rap.id} />}
          </Stack>
        </Box>
        <CardMedia
          component='img'
          alt='rap-cover-art'
          onClick={navigateToRap}
          image={coverArtUrl ? `${BUCKET_URL}/${coverArtUrl}` : `${BUCKET_URL}/default/cover-art.jpg`}
          sx={{
            height: 100,
            width: 100,
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        />
      </Stack>
    </Box>
  );
}

export default RapCard;
