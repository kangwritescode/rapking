import { Box, Card, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { api } from 'src/utils/api';
import RapCard from '../RapCard';

function LatestRapsSection() {
  const { data, refetch } = api.feed.queryRaps.useInfiniteQuery(
    {
      sortBy: 'NEWEST',
      regionFilter: 'ALL',
      timeFilter: 'ALL',
      followingFilter: false,
      sexFilter: 'ANY',
      limit: 3
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      refetchOnReconnect: false
    }
  );

  const rapData = data?.pages.flatMap(page => page.raps) ?? [];

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <Box component='section' p='2rem 2rem 6rem'>
      <Typography variant='h4' sx={{ mb: '2rem' }} fontFamily='impact'>
        Latest Raps
      </Typography>
      <Stack
        gap='1.5rem'
        sx={{
          flexDirection: {
            xs: 'column',
            md: 'row'
          }
        }}
      >
        {rapData.map(rap => {
          return (
            <Card
              key={rap.id}
              sx={{
                p: '2rem 2rem',
                borderRadius: '1rem'
              }}
            >
              <RapCard rap={rap} showChips contentMaxLength={100} />
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}

export default LatestRapsSection;
