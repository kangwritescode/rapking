import React, { Fragment, useCallback, useEffect } from 'react';
import RapComment from './RapComment';
import { CircularProgress, Divider, Stack } from '@mui/material';
import { api } from 'src/utils/api';
import { Virtuoso } from 'react-virtuoso';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';

interface RapCommentsProps {
  sortBy: 'POPULAR' | 'RECENT';
  rapId?: string;
}

function RapComments({ sortBy, rapId }: RapCommentsProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading: commentsAreLoading
  } = api.rapComment.getRapComments.useInfiniteQuery(
    {
      rapId: rapId as string,
      sortBy,
      limit: 5
    },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      refetchOnReconnect: false
    }
  );

  const queryClient = useQueryClient();

  const clearQueryCache = useCallback(() => {
    const postListKey = getQueryKey(
      api.rapComment.getRapComments,
      {
        rapId: rapId as string,
        sortBy,
        limit: 5
      },
      'infinite'
    );
    queryClient.removeQueries(postListKey);
    queryClient.setQueryDefaults(postListKey, {});
  }, [queryClient, rapId, sortBy]);

  useEffect(() => {
    return clearQueryCache;
  }, [clearQueryCache]);

  const rapCommentsData = data?.pages.flatMap(page => page.rapComments) ?? [];

  return (
    <Virtuoso
      style={{
        width: '100%'
      }}
      data={rapCommentsData}
      totalCount={rapCommentsData.length}
      endReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      overscan={200}
      width='100%'
      itemContent={(_, rapComment) => (
        <Fragment key={rapComment.id}>
          <RapComment
            sx={{
              py: 5
            }}
            key={rapComment.id}
            comment={rapComment}
          />
          <Divider />
        </Fragment>
      )}
      components={{
        ...(commentsAreLoading && {
          Header: () => (
            <Stack alignItems='center' justifyContent='center' height='5rem'>
              <CircularProgress color='inherit' size={20} />
            </Stack>
          )
        }),
        ...(hasNextPage && {
          Footer: () => (
            <Stack alignItems='center' justifyContent='center' height='5rem'>
              <CircularProgress color='inherit' size={20} />
            </Stack>
          )
        })
      }}
    />
  );
}

export default RapComments;
