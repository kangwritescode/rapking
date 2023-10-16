import React, { CSSProperties, useCallback, useEffect, useState } from 'react'
import { RegionFilter, SexFilter, SortByValue, TimeFilter } from 'src/server/api/routers/rap';
import { api } from 'src/utils/api';
import { FixedSizeList as List, ListOnItemsRenderedProps } from 'react-window';
import { Rap, User } from '@prisma/client';
import FeedRapCard from './FeedRapCard';
import FallbackSpinner from 'src/@core/components/spinner';
import { useTheme } from '@mui/material';

interface FeedProps {
  sortBy: SortByValue
  regionFilter: RegionFilter
  timeFilter: TimeFilter
  followingFilter: boolean
  sexFilter: SexFilter
}

const PAGE_SIZE = 10;

function Feed({
  sortBy,
  regionFilter,
  timeFilter,
  followingFilter,
  sexFilter
}: FeedProps) {

  // State
  const [raps, setRaps] = useState<(Rap & { user: User })[]>([]);
  const [page, setPage] = useState(0);
  const [areMoreRapsToLoad, setAreMoreRapsToLoad] = useState(true);

  const { refetch } = api.feed.queryRaps.useQuery({
    sortBy,
    regionFilter,
    timeFilter,
    followingFilter,
    sexFilter,
    page,
    pageSize: PAGE_SIZE
  }, {
    enabled: false
  });

  const loadNextPage = useCallback(async () => {
    const { status, data } = await refetch();
    if (status === 'success') {
      const { rapsData } = data;
      if (rapsData.length) {
        setRaps((prevRaps) => [...prevRaps, ...rapsData]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setAreMoreRapsToLoad(false);
      }
    }
  }, [refetch])

  useEffect(() => {
    setPage(0);
    setRaps([]);
    setAreMoreRapsToLoad(true);
  }, [sortBy, regionFilter, timeFilter, followingFilter, sexFilter, loadNextPage])

  useEffect(() => {
    if (!raps.length && areMoreRapsToLoad) {
      loadNextPage();
    }
  }, [loadNextPage, raps, areMoreRapsToLoad])

  const handleItemsRendered = ({ visibleStopIndex }: ListOnItemsRenderedProps) => {
    if (visibleStopIndex >= raps.length - 2 && areMoreRapsToLoad) {
      loadNextPage()
    }
  };

  const Row = ({ index, style }: { index: number; style: CSSProperties; }) => {
    const rap = raps[index];
    if (!rap) return <FallbackSpinner sx={style} />;

    return <FeedRapCard rap={rap} sx={style} />;
  };

  const theme = useTheme();
  const isMobile = theme.breakpoints.down('sm');

  return (
    <List
      height={isMobile ? 550 : 650}
      itemCount={raps.length}
      itemSize={182}
      width='100%'
      onItemsRendered={handleItemsRendered}>
      {Row}
    </List>
  )
}

export default Feed;
