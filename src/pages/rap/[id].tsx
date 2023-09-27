import { CardMedia, Divider, Link, Stack, Typography, styled, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react'
import { CDN_URL } from 'src/shared/constants';
import { api } from 'src/utils/api';
import RapContent from './RapContent';
import RapBar from './RapBar';

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
  const { data: rapData } = api.rap.getRap.useQuery({
    id: id as string,
    withUser: true,
    withComments: true,
    withLikes: true
  });

  const userData = rapData?.User;

  return (
    <Stack
      direction='column'
      alignItems='center'>
      <Stack width={{ xs: '100%', md: '40rem' }}>
        <CardMedia
          component='img'
          alt='profile-header'
          image={rapData?.coverArtUrl || `${CDN_URL}/default/cover-art.jpg`}
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
        <Stack direction='row' mt={theme.spacing(4)} mb={theme.spacing(4)} alignItems="center" justifyContent="space-between">
          <Stack direction='row'>
            <ProfilePicture
              src={userData?.profileImageUrl ? `${CDN_URL}/${userData.profileImageUrl}` : `${CDN_URL}/default/profile-male-default.jpg`}
              alt='profile-picture'
              onClick={() => router.push(`/u/${userData?.username}/raps`)}
              sx={{ mr: theme.spacing(4) }}
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
        </Stack>
        <Divider />
        <RapBar rapData={rapData} />
        <Divider />
        {rapData?.content && <RapContent sx={{ marginTop: theme.spacing(2) }} content={rapData.content} />}
      </Stack>
    </Stack>
  )
}

export default RapPage;
