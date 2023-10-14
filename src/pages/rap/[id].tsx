import { Avatar, CardMedia, Divider, Link, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react'
import { BUCKET_URL } from 'src/shared/constants';
import { api } from 'src/utils/api';
import TipTapContent from './TipTapContent';
import RapBar from './RapBar';


function RapPage() {

  const theme = useTheme();
  const router = useRouter();

  const { id } = router.query;
  const { data: rapData } = api.rap.getRap.useQuery({ id: id as string }, { enabled: Boolean(id) });

  const userData = rapData?.user;

  return (
    <Stack
      direction='column'
      alignItems='center'>
      <Stack width={{ xs: '100%', md: '40rem' }}>
        <CardMedia
          component='img'
          alt='profile-header'
          image={rapData?.coverArtUrl ? `${BUCKET_URL}/${rapData?.coverArtUrl}` : `${BUCKET_URL}/default/cover-art.jpg`}
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
            <Avatar
              {...(userData?.profileImageUrl && {
                src: `${BUCKET_URL}/${userData.profileImageUrl}`,
              })}
              alt='profile-picture'
              onClick={() => router.push(`/u/${userData?.username}/raps`)}
              sx={{
                mr: theme.spacing(4),
                width: 50,
                height: 50,
                cursor: 'pointer',
              }}
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
        {rapData?.content && <TipTapContent sx={{ marginTop: theme.spacing(2) }} content={rapData.content} />}
      </Stack>
    </Stack>
  )
}

export default RapPage;

import { createServerSideHelpers } from '@trpc/react-query/server';
import { GetServerSidePropsContext } from 'next';
import { appRouter } from 'src/server/api/root';
import superjson from 'superjson';
import { createTRPCContext } from 'src/server/api/trpc'

export async function getServerSideProps(context: GetServerSidePropsContext) {

  const { id } = context.query;

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createTRPCContext(context),
    transformer: superjson,
  });

  await helpers.rap.getRap.prefetch({ id })

  return {
    props: {
      trpcState: helpers.dehydrate(),
    }
  }
}
