import { Box, CardMedia, Divider, Stack, SxProps, Typography, styled, useTheme } from '@mui/material';
import { Rap, User } from '@prisma/client'
import React from 'react'
import { CDN_URL } from 'src/shared/constants';
import { convert } from 'html-to-text';
import { useRouter } from 'next/router';

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 24,
  height: 24,
  borderRadius: '100px',
  position: 'relative',
  marginRight: theme.spacing(2),
  cursor: 'pointer',
}))

interface FeedRapCardProps {
  rap: Rap & { User: User };
  sx?: SxProps;
}

function FeedRapCard({ rap, sx }: FeedRapCardProps) {
  const { id, title, dateCreated, coverArtUrl, content, User: userData } = rap;

  const theme = useTheme();
  const router = useRouter();

  const navigateToProfile = () => {
    router.push(`/u/${userData?.username}/profile`);
  }

  const navigateToRap = () => {
    router.push(`/rap/${id}`);
  }

  let formattedContent = convert(content);
  formattedContent = formattedContent.length > 160 ? `${formattedContent.slice(0, 160)}...` : formattedContent;

  return (
    <Box sx={sx}>
      <Stack direction='row' alignItems='center' pb={theme.spacing(2)}>
        <ProfilePicture
          onClick={navigateToProfile}
          src={userData?.profileImageUrl ?
            `${CDN_URL}/${userData.profileImageUrl}` :
            `${CDN_URL}/default/profile-male-default.jpg`}
          alt='profile-picture' />
        <Typography onClick={navigateToProfile} sx={{ cursor: 'pointer' }}> {userData?.username}&nbsp;·&nbsp; </Typography>
        <Typography>{dateCreated?.toLocaleDateString()}</Typography>
      </Stack>
      <Stack direction='row' justifyContent='space-between'>
        <Box
          width='calc(100% - 100px)'
          pr={theme.spacing(12)}
          sx={{
            wordBreak: 'break-all',
            cursor: 'pointer',
          }}
          onClick={navigateToRap}>
          <Typography
            fontSize={theme.typography.h6.fontSize}
            fontWeight='bold'>
            {title}
          </Typography>
          {formattedContent}
        </Box>
        <CardMedia
          component='img'
          alt='rap-cover-art'
          onClick={navigateToRap}
          image={
            coverArtUrl ?
              `${CDN_URL}/${coverArtUrl}` :
              `${CDN_URL}/default/cover-art.jpg`
          }
          sx={{
            height: 100,
            width: 100,
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        />
      </Stack>
      <Divider
        sx={{
          marginTop: theme.spacing(6),
          marginBottom: theme.spacing(6)
        }} />
    </Box>
  )
}

export default FeedRapCard
