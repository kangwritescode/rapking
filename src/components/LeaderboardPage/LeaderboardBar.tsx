import { Box, MenuItem, Select, Stack, SxProps, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { RegionFilter, SexFilter, TimeFilter } from 'src/server/api/routers/rap';

interface LeaderboardBarProps {
  sx?: SxProps;
  onSortAndFilterChange?: ({
    regionFilter,
    timeFilter,
    sexFilter
  }: {
    regionFilter: RegionFilter;
    timeFilter: TimeFilter;
    sexFilter: SexFilter;
  }) => void;
}

function LeaderboardBar({ sx, onSortAndFilterChange }: LeaderboardBarProps) {
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('ALL');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('THIS_WEEK');
  const [sexFilter, setSexFilter] = useState<SexFilter>('ANY');

  useEffect(() => {
    if (onSortAndFilterChange) {
      onSortAndFilterChange({
        regionFilter,
        timeFilter,
        sexFilter
      });
    }
  }, [, regionFilter, timeFilter, sexFilter, onSortAndFilterChange]);

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
          defaultValue='THIS_WEEK'
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
          <MenuItem value='TODAY'>Today</MenuItem>
          <MenuItem value='THIS_WEEK'>This Week</MenuItem>
          <MenuItem value='THIS_MONTH'>This Month</MenuItem>
          <MenuItem value='THIS_YEAR'>This Year</MenuItem>
        </Select>
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
