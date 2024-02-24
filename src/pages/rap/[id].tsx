import { Divider, Stack, Typography } from '@mui/material';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Rap from 'src/components/RapPage/Rap';
import ViewMoreRaps from 'src/components/ViewMoreRaps';
import { BUCKET_URL } from 'src/shared/constants';
import { useRapStore } from 'src/stores/rapStore';
import { api } from 'src/utils/api';

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
  const router = useRouter();
  const session = useSession();

  const setRapContext = useRapStore(state => state.setContext);

  useEffect(() => {
    setRapContext('rap-page');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { id } = router.query;

  const { data: rapData } = api.rap.getRap.useQuery({ id: id as string }, { enabled: Boolean(id) });

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
        <Rap
          sx={{
            width: {
              xs: '100%',
              md: '44rem'
            },
            pb: '2rem'
          }}
          rapData={rapData}
        />
      </Stack>
      <Divider />
      {rapData && <ViewMoreRaps viewedRap={rapData} />}
    </>
  );
}

export default RapPage;
