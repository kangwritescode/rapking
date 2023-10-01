import React from 'react'
import { api } from 'src/utils/api'
import { Box, Stack, Tab, Tabs, useTheme } from '@mui/material';
import FeedRapCard from './FeedRapCard';
import FeedBar from './FeedBar';
import { RegionFilter, SortByValue, TimeFilter } from 'src/server/api/routers/rap';

function ExplorePage() {

  const theme = useTheme();

  // Tabs
  const [tab, setTab] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  // Feed
  const [sortByValue, setSortByValue] = React.useState<SortByValue>('NEWEST');
  const [regionFilter, setRegionFilter] = React.useState<RegionFilter>('ALL');
  const [timeFilter, setTimeFilter] = React.useState<TimeFilter>('ALL');

  const { data: raps } = api.rap.queryRaps.useQuery({
    sortBy: sortByValue,
    regionFilter,
    timeFilter,
    includeUser: true
  });

  return (
    <Stack
      alignItems='center'
      sx={{
        width: [
          '100%',
          '90%',
          '80%'
        ],
        maxWidth: '45rem',
        margin: 'auto'
      }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          width: '100%',
          mb: '1rem'
        }}>
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
          }}>
          <Tab label="All" />
          <Tab label="Following" />
        </Tabs>
      </Box>
      {tab === 0 && (
        <FeedBar
          sx={{ mb: '2rem' }}
          onSortAndFilterChange={({
            sortBy,
            regionFilter,
            timeFilter
          }) => {
            setSortByValue(sortBy);
            setRegionFilter(regionFilter);
            setTimeFilter(timeFilter);
          }
          }
        />
      )}
      {raps?.map((rap) =>
        <FeedRapCard
          key={rap.id}
          rap={rap}
          sx={{
            width: '100%',
          }}
        />
      )
      }
    </Stack>
  )
}

export default ExplorePage
