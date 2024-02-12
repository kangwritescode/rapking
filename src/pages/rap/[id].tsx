import {
  Avatar,
  CardMedia,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Rap, User } from '@prisma/client';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SCPlayer from 'src/components/SCPlayer';
import YTPlayer from 'src/components/YTPlayer';
import { BUCKET_URL } from 'src/shared/constants';
import { api } from 'src/utils/api';
import RapBar from '../../components/RapPage/RapBar';
import TipTapContent from '../../components/TipTapContent';

const RapHead = ({ rapData }: { rapData: Rap & { user: Partial<User> } }) => {
  return (
    <Head>
      <title key='title'>{rapData?.title} - RapKing</title>
      <meta name='description' content={rapData?.content} />
      <meta property='og:title' content={rapData?.title} />
      <meta property='og:description' content={rapData?.content} />
      <meta property='og:url' content={`https://rapking.io/rap/${rapData?.id}`} />
      <meta property='og:image' content={`${BUCKET_URL}/${rapData?.coverArtUrl}`} />
      <meta property='og:type' content='website' />
      <meta property='og:site_name' content='RapKing' />
      <meta property='og:locale' content='en_US' />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={rapData?.title} />
      <meta name='twitter:description' content={rapData?.content} />
      <meta name='twitter:image' content={`${BUCKET_URL}/${rapData?.coverArtUrl}`} />
      <meta name='twitter:domain' content='rapking.io' />
      <link rel='canonical' href={`https://rapking.io/rap/${rapData?.id}`} />
    </Head>
  );
};

function RapPage() {
  const theme = useTheme();
  const router = useRouter();
  const session = useSession();

  const { id, commentId } = router.query;

  const { data: rapData } = api.rap.getRap.useQuery({ id: id as string }, { enabled: Boolean(id) });

  const userData = rapData?.user;

  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));

  if (rapData?.status === 'DRAFT' && rapData?.userId !== session.data?.user?.id) {
    return (
      <Stack
        direction='column'
        alignItems='center'
        padding={{
          xs: '2rem 1rem',
          md: '2.5rem'
        }}
      >
        <Typography variant='h4' fontWeight='bold'>
          This rap is private
        </Typography>
      </Stack>
    );
  }

  return (
    <>
      {rapData && <RapHead rapData={rapData} />}
      <Stack
        direction='column'
        alignItems='center'
        padding={{
          xs: '2rem 1rem',
          md: '2.5rem'
        }}
      >
        <Stack width={{ xs: '100%', md: '44rem' }}>
          <CardMedia
            component='img'
            alt='profile-header'
            image={
              rapData?.coverArtUrl
                ? `${BUCKET_URL}/${rapData?.coverArtUrl}`
                : `${BUCKET_URL}/default/cover-art.jpg`
            }
            sx={{
              marginBottom: 10,
              height: {
                xs: 200,
                sm: 250,
                md: 300
              }
            }}
          />
          <Typography variant='h4' fontWeight='bold'>
            {rapData?.title}
          </Typography>
          <Stack
            direction='row'
            mt={theme.spacing(4)}
            mb={theme.spacing(4)}
            alignItems='center'
            justifyContent='space-between'
          >
            <Stack direction='row'>
              <Link
                onClick={() => router.push(`/u/${userData?.username}`)}
                style={{ textDecoration: 'none' }}
                href={`/u/${userData?.username}`}
              >
                <Avatar
                  {...(userData?.profileImageUrl && {
                    src: `${BUCKET_URL}/${userData.profileImageUrl}`
                  })}
                  alt='profile-picture'
                  onClick={() => router.push(`/u/${userData?.username}`)}
                  sx={{
                    mr: theme.spacing(4),
                    width: 50,
                    height: 50,
                    cursor: 'pointer'
                  }}
                />
              </Link>
              <Stack>
                <Link
                  onClick={() => router.push(`/u/${userData?.username}`)}
                  style={{ textDecoration: 'none' }}
                  href={`/u/${userData?.username}`}
                >
                  <Typography fontWeight='bold'>{userData?.username}</Typography>
                </Link>
                <Typography>{rapData?.dateCreated.toLocaleDateString()}</Typography>
              </Stack>
            </Stack>
          </Stack>
          <Divider />
          <RapBar
            rapData={rapData}
            threadId={rapData?.rapThread?.threadId}
            defaultCommentDrawerIsOpen={Boolean(commentId)}
          />
          <Divider />
          {rapData?.soundcloudUrl ? (
            <SCPlayer
              sx={{
                mt: '1.75rem',
                height: '7.25rem'
              }}
              showArtwork
              url={rapData?.soundcloudUrl}
            />
          ) : undefined}
          {rapData?.youtubeVideoId ? (
            <YTPlayer
              sx={{
                mt: '1.75rem',
                height: isMobileView ? '15rem' : '24rem'
              }}
              videoId={rapData?.youtubeVideoId}
            />
          ) : undefined}
          {rapData?.content && (
            <TipTapContent sx={{ marginTop: theme.spacing(2) }} content={rapData.content} />
          )}
        </Stack>
      </Stack>
      <Divider />
      {rapData && <ViewMoreRaps viewedRap={rapData} />}
    </>
  );
}

export default RapPage;

import { useSession } from 'next-auth/react';
import ViewMoreRaps from 'src/components/ViewMoreRaps';
