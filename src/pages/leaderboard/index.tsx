import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import SpotlightCard from 'src/components/LeaderboardPage/SpotlightCard';
import UserLeaderboard from '../../components/LeaderboardPage/UserLeaderboard';

function LeaderboardPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <Stack alignItems='center' height='100%' width='100%' mx='auto'>
      <Typography
        component='h1'
        width='63.5rem'
        textAlign='left'
        fontSize='1.5rem'
        fontWeight={600}
        mb='1rem'
      >
        Leaderboard
      </Typography>
      <Stack direction='row' gap='1.5rem' height='100%'>
        <Box
          sx={theme => ({
            p: '1rem 1rem 2rem 2rem',
            height: 'calc(100vh - 9em)',
            overflow: 'hidden',
            border: `1px solid ${theme.palette.grey[800]}`,
            borderRadius: '1rem',
            position: 'relative'
          })}
          width='42rem'
        >
          <UserLeaderboard
            selectedUserId={selectedUserId}
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
