import { Box, MenuItem, Select, Stack, SxProps, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RegionFilter, SexFilter, SortByValue, TimeFilter } from 'src/server/api/routers/rap';

interface FeedBarProps {
  sx?: SxProps;
  onSortAndFilterChange?: ({
    sortBy,
    regionFilter,
    timeFilter,
    sexFilter
  }: {
    sortBy: SortByValue;
    regionFilter: RegionFilter;
    timeFilter: TimeFilter;
    sexFilter: SexFilter;
  }) => void;
}

function FeedBar({ sx, onSortAndFilterChange }: FeedBarProps) {
  const [sortBy, setSortBy] = useState<SortByValue>('NEWEST');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('ALL');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('ALL');
  const [sexFilter, setSexFilter] = useState<SexFilter>('ANY');

  useEffect(() => {
    if (onSortAndFilterChange) {
      onSortAndFilterChange({
        sortBy,
        regionFilter,
        timeFilter,
        sexFilter
      });
    }
  }, [sortBy, regionFilter, timeFilter, sexFilter, onSortAndFilterChange]);

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
          defaultValue='ALL'
          size='small'
          sx={{
            maxWidth: regionFilter !== 'MIDWEST' ? '5rem' : '5.5rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            mr: '.5rem'
          }}
          value={regionFilter}
          onChange={e => setRegionFilter(e.target.value as RegionFilter)}
        >
          <MenuItem value='ALL'>All US</MenuItem>
          <MenuItem value='WEST'>West</MenuItem>
          <MenuItem value='EAST'>East</MenuItem>
          <MenuItem value='MIDWEST'>Midwest</MenuItem>
          <MenuItem value='SOUTH'>South</MenuItem>
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
