import { Box } from '@mui/material';
import { useEffect } from 'react';
import { api } from 'src/utils/api';

declare global {
  interface Window {
    $: any;
  }
}

const ForumPage = () => {
  const muutCredentialsQuery = api.muut.generateMuutCredentials.useQuery();

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
        }
      }}
    >
      <a id='muut-embed' href='https://muut.com/i/rapking' />
    </Box>
  );
};

export default ForumPage;
