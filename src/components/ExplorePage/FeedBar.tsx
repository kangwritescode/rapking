import { Box, MenuItem, Select, Stack, SxProps, Typography } from '@mui/material';
import { Country } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CountryFilter, SexFilter, SortByValue, TimeFilter } from 'src/server/api/routers/rap';

interface FeedBarProps {
  sx?: SxProps;
  onSortAndFilterChange?: ({
    sortBy,
    countryFilter,
    timeFilter,
    sexFilter
  }: {
    sortBy: SortByValue;
    countryFilter: CountryFilter;
    timeFilter: TimeFilter;
    sexFilter: SexFilter;
  }) => void;
}

function FeedBar({ sx, onSortAndFilterChange }: FeedBarProps) {
  const { query } = useRouter();
  const queryCountryFilter = query['us-country'] as CountryFilter;

  const [sortBy, setSortBy] = useState<SortByValue>('NEWEST');
  const [countryFilter, setCountryFilter] = useState<CountryFilter>(queryCountryFilter || 'ALL');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('ALL');
  const [sexFilter, setSexFilter] = useState<SexFilter>('ANY');

  useEffect(() => {
    if (onSortAndFilterChange) {
      onSortAndFilterChange({
        sortBy,
        countryFilter,
        timeFilter,
        sexFilter
      });
    }
  }, [sortBy, countryFilter, timeFilter, sexFilter, onSortAndFilterChange]);

  return (
    <Box
      width='100%'
      display='flex'
      alignItems={['left', 'center']}
      justifyContent='flex-end'
      flexDirection={['column-reverse', 'row']}
      sx={sx}
    >
      <Stack direction='row' alignItems='center'>
        <Typography variant='body2'>Sort By: &nbsp;</Typography>
        <Select
          defaultValue='NEWEST'
          size='small'
          sx={{
            width: '4.25rem',
            borderRadius: '20px',
            fontSize: '0.75rem'
          }}
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortByValue)}
        >
          <MenuItem value='NEWEST'>New</MenuItem>
        </Select>
      </Stack>
      <Stack direction='row' alignItems='center' mb={[2, 'unset']}>
        <Typography variant='body2' ml={['', '1rem']}>
          Filter By: &nbsp;
        </Typography>
        <Select
          defaultValue={'ALL'}
          size='small'
          sx={{
            maxWidth: countryFilter === 'ALL' ? '7.5rem' : '4rem',
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
        </Select>
        <Select
          defaultValue='ALL'
          size='small'
          sx={{
            width: timeFilter === 'ALL' ? '5.5rem' : '8rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            mr: '.5rem'
          }}
          value={timeFilter}
          onChange={e => setTimeFilter(e.target.value as TimeFilter)}
        >
          <MenuItem value='ALL'>All Time</MenuItem>
          <MenuItem value='24HOURS'>Last 24 Hours</MenuItem>
          <MenuItem value='7DAYS'>Last 7 Days</MenuItem>
          <MenuItem value='30DAYS'>Last 30 Days</MenuItem>
          <MenuItem value='6MONTHS'>Last 6 Months</MenuItem>
          <MenuItem value='12MONTHS'>Last 12 Months</MenuItem>
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

export default FeedBar;
