import { CardMedia, Divider, Stack, Typography, styled, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react'
import { CDN_URL } from 'src/shared/constants';
import { api } from 'src/utils/api';
import { convert } from 'html-to-text';

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: '100px',
  position: 'relative',
  marginRight: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

function RapPage() {

  const theme = useTheme();
  const router = useRouter();
  const { id } = router.query;
  const { data: rapData } = api.rap.getRap.useQuery({ id: id as string });
  const { data: userData } = api.user.findById.useQuery({ id: rapData?.userId || '' }, { enabled: !!(rapData?.userId) })

  console.log(rapData?.content)

  return (
    <Stack direction='column' alignItems='center'>
      <Stack maxWidth='40rem'>
        <CardMedia
          component='img'
          alt='profile-header'
          image={rapData?.coverArtUrl || `${CDN_URL}/default/profile-banner.jpg`}
          sx={{
            marginBottom: 10,
            height: {
              xs: 200,
              sm: 250,
              md: 300,
            }
          }}
        />
        <Typography variant='h4' fontWeight='bold'>
          {rapData?.title}
        </Typography>
        <Stack direction='row' mt={theme.spacing(4)} mb={theme.spacing(4)}>
          <ProfilePicture
            src={userData ? `${CDN_URL}/${userData.profileImageUrl}` : `${CDN_URL}/default/profile-male-default.jpg`}
            alt='profile-picture'
          />
          <Stack>
            <Typography fontWeight='bold'>
              {userData?.username}
            </Typography>
            <Typography>
              {rapData?.dateCreated.toLocaleDateString()}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Typography
          mt={theme.spacing(8)}
          variant='body1'
          sx={{ wordWrap: 'break-word' }}
        >
          {convert(rapData?.content || '')}
        </Typography>
      </Stack>
    </Stack>
  )
}

export default RapPage;
