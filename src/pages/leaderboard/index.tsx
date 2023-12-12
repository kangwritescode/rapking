import { Box } from '@mui/material';
import UserLeaderboard from '../../components/LeaderboardPage/UserLeaderboard';

function LeaderboardPage() {
  return (
    <>
      <Box
        sx={{
          mx: 'auto',
          mt: '4rem'
        }}
        width={['100%', '630px']}
      >
        <UserLeaderboard />
      </Box>
    </>
  );
}

export default LeaderboardPage;
