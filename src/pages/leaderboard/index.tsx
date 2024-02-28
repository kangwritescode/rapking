import { Box, Stack, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import Footer from 'src/components/Footer';
import LeaderboardBar from 'src/components/LeaderboardPage/LeaderboardBar';
import SpotlightCard from 'src/components/LeaderboardPage/SpotlightCard';
import {
  LeaderboardCountryFilter,
  LeaderboardSexFilter,
  LeaderboardTimeFilter
} from 'src/server/api/routers/leaderboard';
import LeaderboardCards from '../../components/LeaderboardPage/LeaderboardCards';

function LeaderboardPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [countryFilter, setCountryFilter] = useState<LeaderboardCountryFilter>('ALL');
  const [timeFilter, setTimeFilter] = useState<LeaderboardTimeFilter>('ALL_TIME');
  const [sexFilter, setSexFilter] = useState<LeaderboardSexFilter>('ANY');

  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const theme = useTheme();

  return (
    <>
      <Stack
        width={{
          xs: '100%',
          md: 'fit-content'
        }}
        height='100%'
        mx='auto'
        sx={{
          padding: `3rem ${theme.spacing(6)} 1rem`,
          transition: 'padding .25s ease-in-out',
          [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4)
          }
        }}
      >
        <Typography
          component='h1'
          textAlign='left'
          fontSize='2rem'
          fontWeight={600}
          mb='1rem'
          fontFamily='impact'
        >
          Leaderboard
        </Typography>
        <Stack direction='row' gap='1.5rem' justifyContent='center' width='100%' height='100%'>
          <Box
            sx={theme => ({
              p: {
                xs: 0,
                md: '1.4rem 1.6rem 2rem 2.2rem'
              },
              overflow: 'hidden',
              border: {
                xs: 'none',
                md: `1px solid ${theme.palette.grey[800]}`
              },
              borderRadius: '.5rem',
              position: 'relative',
              height: '100%'
            })}
            width={{
              xs: '100%',
              md: '40rem'
            }}
          >
            <LeaderboardBar
              sx={{
                mb: '1rem',
                position: 'relative',
                pr: '.7rem',
                justifyContent: {
                  xs: 'flex-start',
                  md: 'flex-end'
                }
              }}
              onSortAndFilterChange={({ countryFilter, timeFilter, sexFilter }) => {
                setCountryFilter(countryFilter);
                setTimeFilter(timeFilter);
                setSexFilter(sexFilter);
              }}
            />
            <LeaderboardCards
              sx={{
                height: '100%'
              }}
              selectedUserId={selectedUserId}
              userClickHandler={userId => {
                setSelectedUserId(userId);
              }}
              countryFilter={countryFilter}
              timeFilter={timeFilter}
              sexFilter={sexFilter}
            />
          </Box>
          {!isTablet ? <SpotlightCard userId={selectedUserId} /> : undefined}
        </Stack>
      </Stack>
      <Footer />
    </>
  );
}

export default LeaderboardPage;
