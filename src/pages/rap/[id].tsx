import { CardMedia, Divider, Link, Stack, Typography, styled, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react'
import { CDN_URL } from 'src/shared/constants';
import { api } from 'src/utils/api';
import RapContent from './RapContent';

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: '100px',
  position: 'relative',
  marginRight: theme.spacing(2),
  cursor: 'pointer',
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

  return (
    <Stack direction='column' alignItems='center'>
      <Stack width={{ xs: '100%', md: '40rem' }}>
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
            src={userData?.profileImageUrl ? `${CDN_URL}/${userData.profileImageUrl}` : `${CDN_URL}/default/profile-male-default.jpg`}
            alt='profile-picture'
            onClick={() => router.push(`/u/${userData?.username}/raps`)}
          />
          <Stack>
            <Link>
              <Typography fontWeight='bold'>
                {userData?.username}
              </Typography>
            </Link>
            <Typography>
              {rapData?.dateCreated.toLocaleDateString()}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        {rapData?.content && <RapContent sx={{ marginTop: theme.spacing(2) }} content={rapData.content} />}
      </Stack>
    </Stack>
  )
}

export default RapPage;
