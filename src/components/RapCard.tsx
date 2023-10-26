import { Avatar, Box, CardMedia, Stack, SxProps, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Rap, User } from '@prisma/client'
import React from 'react'
import { BUCKET_URL } from 'src/shared/constants';
import { convert } from 'html-to-text';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

interface RapCardProps {
  rap: Rap & { user: User };
  sx?: SxProps;
  hideAvatar?: boolean;
  hideUsername?: boolean;
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

function RapCard({ rap, sx, hideAvatar, hideUsername }: RapCardProps) {
  const { id, title, dateCreated, coverArtUrl, content, user: userData } = rap;

  const theme = useTheme();
  const router = useRouter();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumView = useMediaQuery(theme.breakpoints.down('md'));

  const navigateToProfile = () => {
    router.push(`/u/${userData?.username}`);
  }

  const navigateToRap = () => {
    router.push(`/rap/${id}`);
  }

  let formattedContent = convert(content);
  const maxLength = isMobileView ? 50 : isMediumView ? 100 : 160;

  if (formattedContent.length > maxLength) {
    formattedContent = `${formattedContent.slice(0, maxLength)}...`;
  }

  return (
    <Box sx={sx}>
      <Stack direction='row' alignItems='center' pb={theme.spacing(2)}>
        {!hideAvatar && (
          <Avatar
            onClick={navigateToProfile}
            {...(userData?.profileImageUrl && {
              src: `${BUCKET_URL}/${userData.profileImageUrl}`,
            })}
            alt='profile-picture'
            sx={{
              width: 24,
              height: 24,
              cursor: 'pointer',
              marginRight: theme.spacing(2),
              position: 'relative',
            }}
          />
        )}
        {!hideUsername && (
          <Typography
            fontSize='.875rem'
            onClick={navigateToProfile}
            sx={{ cursor: 'pointer' }}> {userData?.username}&nbsp;·&nbsp; </Typography>
        )}
        <Typography fontSize='.875rem'>{formatDate(dateCreated)}</Typography>
      </Stack>
      <Stack direction='row' justifyContent='space-between'>
        <Box
          width='calc(100% - 100px)'
          pr={theme.spacing(12)}
          sx={{
            wordBreak: 'keep-all',
            cursor: 'pointer',
          }}
          onClick={navigateToRap}>
          <Typography
            fontSize='1.25rem'
            fontWeight='bold'>
            {title}
          </Typography>
          <Typography>
            {formattedContent}
          </Typography>
        </Box>
        <CardMedia
          component='img'
          alt='rap-cover-art'
          onClick={navigateToRap}
          image={
            coverArtUrl ?
              `${BUCKET_URL}/${coverArtUrl}` :
              `${BUCKET_URL}/default/cover-art.jpg`
          }
          sx={{
            height: 100,
            width: 100,
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        />
      </Stack>
    </Box>
  )
}

export default RapCard
