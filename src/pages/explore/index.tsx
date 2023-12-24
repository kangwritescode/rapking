import { Box, Stack, Tab, Tabs, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { RegionFilter, SexFilter, SortByValue, TimeFilter } from 'src/server/api/routers/rap';
import FeedBar from '../../components/ExplorePage/FeedBar';

import { useSession } from 'next-auth/react';
import Feed from '../../components/ExplorePage/Feed';

function ExplorePage() {
  const theme = useTheme();
  const { status } = useSession();

  // Tabs
  const [tab, setTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  // Feed
  const [sortByValue, setSortByValue] = useState<SortByValue>('NEWEST');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('ALL');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('ALL');
  const [sexFilter, setSexFilter] = useState<SexFilter>('ANY');
  const followingFilter = tab === 1;

  return (
    <Stack
      alignItems='center'
      sx={{
        width: ['100%', '90%', '80%'],
        maxWidth: '45rem',
        margin: 'auto',
        height: '100%',
        padding: theme.spacing(6),
        transition: 'padding .25s ease-in-out',
        [theme.breakpoints.down('sm')]: {
          paddingLeft: theme.spacing(4),
          paddingRight: theme.spacing(4)
        }
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          width: '100%',
          mb: '1rem'
        }}
      >
        <Tabs
          value={tab}
          onChange={handleChange}
          sx={{
            ['& .Mui-selected']: {
              color: theme.palette.grey[100] + ' !important'
            },
            ['& .MuiTabs-indicator']: {
              backgroundColor: theme.palette.grey[100]
            }
          }}
        >
          <Tab label='All' />
          {status === 'authenticated' && <Tab label='Following' />}
        </Tabs>
      </Box>
      <FeedBar
        sx={{ mb: '2rem' }}
        onSortAndFilterChange={({ sortBy, regionFilter, timeFilter, sexFilter }) => {
          setSortByValue(sortBy);
          setRegionFilter(regionFilter);
          setTimeFilter(timeFilter);
          setSexFilter(sexFilter);
        }}
      />
      <Feed
        sortBy={sortByValue}
        regionFilter={regionFilter}
        timeFilter={timeFilter}
        followingFilter={followingFilter}
        sexFilter={sexFilter}
      />
    </Stack>
  );
}

export default ExplorePage;
