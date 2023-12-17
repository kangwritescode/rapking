import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import SpotlightCard from 'src/components/LeaderboardPage/SpotlightCard';
import UserLeaderboard from '../../components/LeaderboardPage/UserLeaderboard';

function LeaderboardPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <Stack px={[0, '6rem']} alignItems='center' height='100%'>
      <Typography
        component='h1'
        sx={{ fontSize: '2.5rem', mb: '2rem', fontWeight: 600 }}
        textAlign='left'
      >
        Leaderboard
      </Typography>
      <Stack direction='row' gap='1.5rem' height='fit-content'>
        <Box
          sx={theme => ({
            p: '2rem 1.5rem 1.5rem 2.5rem',
            height: 'calc(100% - 8rem)',
            overflow: 'hidden',
            border: `1px solid ${theme.palette.grey[800]}`,
            borderRadius: '1rem',
            position: 'relative'
          })}
          width={['42rem']}
        >
          <UserLeaderboard
            userClickHandler={userId => {
              setSelectedUserId(userId);
            }}
          />
        </Box>
        <SpotlightCard userId={selectedUserId} />
      </Stack>
    </Stack>
  );
}

export default LeaderboardPage;

LeaderboardPage.contentHeightFixed = true;
