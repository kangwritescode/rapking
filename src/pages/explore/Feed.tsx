import React, { CSSProperties, useEffect, useState } from 'react'
import { RegionFilter, SexFilter, SortByValue, TimeFilter } from 'src/server/api/routers/rap';
import { api } from 'src/utils/api';
import { FixedSizeList as List, ListOnItemsRenderedProps } from 'react-window';
import { Rap, User } from '@prisma/client';
import FeedRapCard from './FeedRapCard';
import FallbackSpinner from 'src/@core/components/spinner';
import { useMediaQuery, useTheme } from '@mui/material';

interface FeedProps {
  sortByValue: SortByValue
  regionFilter: RegionFilter
  timeFilter: TimeFilter
  followingFilter: boolean
  sexFilter: SexFilter
}

const PAGE_SIZE = 30;

function Feed({
  sortByValue,
  regionFilter,
  timeFilter,
  followingFilter,
  sexFilter
}: FeedProps) {

  // State
  const [raps, setRaps] = useState<(Rap & { user: User })[]>([]);

  const query = {
    sortBy: sortByValue,
    regionFilter,
    timeFilter,
    followingFilter,
    sexFilter,
  };

  const { data, refetch } = api.feed.queryRaps.useQuery({
    ...query,
    page: 0,
    pageSize: PAGE_SIZE
  }, {
    enabled: false
  });

  useEffect(() => {
    if (data) {
      const { rapsData } = data;
      setRaps(rapsData);
    }
  }, [data])

  useEffect(() => {
    refetch();
  }, [refetch])

  const handleItemsRendered = ({ visibleStopIndex }: ListOnItemsRenderedProps) => {
    // const buffer = 5;
    console.log(visibleStopIndex)

    // if (visibleStopIndex + buffer >= raps.length && raps.length < totalRaps) {
    //   refetch();
    // }
  };

  const Row = ({ index, style }: { index: number; style: CSSProperties; }) => {
    const rap = raps[index];

    if (!rap) return <FallbackSpinner sx={style} />;

    return <FeedRapCard rap={rap} sx={style} />;
  };

  return (
    <List
      height={650}
      itemCount={raps.length + 1}
      itemSize={182}
      width='100%'
      onItemsRendered={handleItemsRendered}>
      {Row}
    </List>
  )
}

export default Feed;
