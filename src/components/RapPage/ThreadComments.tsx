import { CircularProgress, Divider, Stack } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { Fragment, useCallback, useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { api } from 'src/utils/api';
import RapComment from './ThreadComment';

interface ThreadCommentsProps {
  sortBy: 'POPULAR' | 'RECENT';
  threadId?: string | null;
}

function ThreadComments({ sortBy, threadId }: ThreadCommentsProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading: commentsAreLoading
  } = api.threadComments.getThreadComments.useInfiniteQuery(
    {
      threadId: threadId as string,
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
      api.threadComments.getThreadComments,
      {
        threadId: threadId as string,
        sortBy,
        limit: 5
      },
      'infinite'
    );
    queryClient.removeQueries(postListKey);
    queryClient.setQueryDefaults(postListKey, {});
  }, [queryClient, threadId, sortBy]);

  useEffect(() => {
    return clearQueryCache;
  }, [clearQueryCache]);

  const rapCommentsData = data?.pages.flatMap(page => page.threadComments) ?? [];

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

export default ThreadComments;
