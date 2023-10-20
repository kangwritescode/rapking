import React, { useCallback, useEffect, useState } from 'react'
import { RegionFilter, SexFilter, SortByValue, TimeFilter } from 'src/server/api/routers/rap';
import { api } from 'src/utils/api';
import { Rap, User } from '@prisma/client';
import FeedRapCard from './FeedRapCard';
import { Divider } from '@mui/material';
import { Virtuoso } from 'react-virtuoso';

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

  // Reset state when filters change
  useEffect(() => {
    setPage(0);
    setRaps([]);
    setAreMoreRapsToLoad(true);
  }, [sortBy, regionFilter, timeFilter, followingFilter, sexFilter, loadNextPage])

  // Load initial page
  useEffect(() => {
    if (!raps.length && areMoreRapsToLoad) {
      loadNextPage();
    }
  }, [loadNextPage, raps, areMoreRapsToLoad])

  return (
    <Virtuoso
      style={{
        width: '100%'
      }}
      data={raps}
      totalCount={raps.length}
      endReached={() => {
        if (areMoreRapsToLoad) {
          loadNextPage();
        }
      }}
      overscan={400}
      width='100%'
      itemContent={(_, rap) => (
        <>
          <FeedRapCard
            key={rap.id}
            rap={rap}
            sx={{ mt: 7, mb: 9 }}
          />
          <Divider />
        </>
      )}
    />
  )
}

export default Feed;
