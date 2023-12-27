import { Box } from '@mui/material';
import { Session } from 'next-auth';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import { useEffect } from 'react';
import { api } from 'src/utils/api';

declare global {
  interface Window {
    $: any;
  }
}

const ForumPage = () => {
  const muutCredentialsQuery = api.muut.generateMuutCredentials.useQuery();
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (muutCredentialsQuery.data) {
      // Initialize Muut with the fetched credentials
      window.$('#muut-embed').muut({
        sso: true,
        api: {
          key: muutCredentialsQuery.data.apiKey,
          message: muutCredentialsQuery.data.message,
          signature: muutCredentialsQuery.data.signature,
          timestamp: muutCredentialsQuery.data.timestamp
        }
      });
    }
  }, [muutCredentialsQuery.data]);

  if (!session.data?.user) {
    return router.push(`/`);
  }

  if (muutCredentialsQuery.isLoading) {
    return <Box>Loading Rapking forums...</Box>;
  }

  if (muutCredentialsQuery.isError) {
    return <Box>Error loading forum. Please refresh the page.</Box>;
  }

  return (
    <Box
      sx={{
        '& .m-me > .m-face': {
          display: 'none'
        },
        '& #moot-logo > a': {
          opacity: 0,
          pointerEvents: 'none'
        }
      }}
    >
      <a id='muut-embed' href='https://muut.com/i/rapking' />
    </Box>
  );
};

export default ForumPage;

export const getServerSideProps: GetServerSideProps = async context => {
  const session: Session | null = await getSession(context);

  if (!session?.user) {
    return {
      redirect: {
        destination: `/`,
        permanent: false
      }
    };
  }

  return {
    props: {} // will be passed to the page component as props
  };
};
