import { Box, MenuItem, Select, Stack, SxProps, Typography } from '@mui/material';
import { Country } from '@prisma/client';
import { useEffect, useState } from 'react';
import {
  LeaderboardCountryFilter,
  LeaderboardSexFilter,
  LeaderboardTimeFilter
} from 'src/server/api/routers/leaderboard';
import { CountryFilter, SexFilter } from 'src/server/api/routers/rap';

interface LeaderboardBarProps {
  sx?: SxProps;
  onSortAndFilterChange?: ({
    countryFilter,
    timeFilter,
    sexFilter
  }: {
    countryFilter: LeaderboardCountryFilter;
    timeFilter: LeaderboardTimeFilter;
    sexFilter: LeaderboardSexFilter;
  }) => void;
}

function LeaderboardBar({ sx, onSortAndFilterChange }: LeaderboardBarProps) {
  const [countryFilter, setCountryFilter] = useState<LeaderboardCountryFilter>('ALL');
  const [timeFilter, setTimeFilter] = useState<LeaderboardTimeFilter>('ALL_TIME');
  const [sexFilter, setSexFilter] = useState<LeaderboardSexFilter>('ANY');

  useEffect(() => {
    if (onSortAndFilterChange) {
      onSortAndFilterChange({
        countryFilter,
        timeFilter,
        sexFilter
      });
    }
  }, [, countryFilter, timeFilter, sexFilter, onSortAndFilterChange]);

  return (
    <Box
      width='100%'
      display='flex'
      alignItems='center'
      justifyContent='flex-end'
      flexDirection='row'
      sx={sx}
    >
      <Stack direction='row' alignItems='center' mb={[2, 'unset']}>
        <Typography variant='body2'>Filter By: &nbsp;</Typography>
        <Select
          defaultValue='ALL_TIME'
          size='small'
          sx={{
            width: timeFilter === 'TODAY' ? '5.5rem' : '6.8rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            mr: '.5rem'
          }}
          value={timeFilter}
          onChange={e => setTimeFilter(e.target.value as LeaderboardTimeFilter)}
        >
          <MenuItem value='TODAY'>Today</MenuItem>
          <MenuItem value='THIS_WEEK'>This Week</MenuItem>
          <MenuItem value='THIS_MONTH'>This Month</MenuItem>
          <MenuItem value='THIS_YEAR'>This Year</MenuItem>
          <MenuItem value='ALL_TIME'>All Time</MenuItem>
        </Select>
        <Select
          defaultValue='ALL'
          size='small'
          sx={{
            maxWidth: countryFilter === 'ALL' ? '7.25rem' : '4.5rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            mr: '.5rem'
          }}
          value={countryFilter}
          onChange={e => setCountryFilter(e.target.value as CountryFilter)}
        >
          <MenuItem value='ALL'>All Countries</MenuItem>
          <MenuItem value={Country.US}>US</MenuItem>
          <MenuItem value={Country.UK}>UK</MenuItem>
          <MenuItem value={Country.CA}>CA</MenuItem>
          <MenuItem value={Country.AU}>AU</MenuItem>
          <MenuItem value={Country.NZ}>NZ</MenuItem>
          <MenuItem value={Country.IE}>IE</MenuItem>
          <MenuItem value={Country.ZA}>ZA</MenuItem>
        </Select>
        <Select
          defaultValue='ANY'
          size='small'
          sx={{
            width: '5.5rem',
            borderRadius: '20px',
            fontSize: '0.75rem'
          }}
          value={sexFilter}
          onChange={e => setSexFilter(e.target.value as SexFilter)}
        >
          <MenuItem value='ANY'>Any Sex</MenuItem>
          <MenuItem value='MALE'>Male</MenuItem>
          <MenuItem value='FEMALE'>Female</MenuItem>
        </Select>
      </Stack>
    </Box>
  );
}

export default LeaderboardBar;
