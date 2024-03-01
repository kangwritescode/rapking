import { CircularProgress, Divider, Stack } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import React, { Fragment, useCallback, useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { api } from 'src/utils/api';
import VirtuosoStyles from '../VirtuosoStyles';
import ThreadComment from './ThreadComment';

interface ThreadCommentsProps {
  sortBy: 'POPULAR' | 'RECENT';
  threadId?: string | null;
  style?: React.CSSProperties;
}

function ThreadComments({ sortBy, threadId, style }: ThreadCommentsProps) {
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
    return () => clearQueryCache();
  }, [clearQueryCache]);

  const threadCommentsData = data?.pages.flatMap(page => page.threadComments) ?? [];

  return (
    <VirtuosoStyles>
      <Virtuoso
        style={{
          width: '100%',
          ...style
        }}
        data={threadCommentsData}
        totalCount={threadCommentsData.length}
        endReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        overscan={200}
        itemContent={(_, threadComment) => (
          <Fragment key={threadComment.id}>
            <ThreadComment
              sx={{
                py: 5,
                pr: 5
              }}
              key={threadComment.id}
              comment={threadComment}
            />
            <Divider
              sx={{
                mr: 5
              }}
            />
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
    </VirtuosoStyles>
  );
}

export default ThreadComments;
