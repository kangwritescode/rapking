import React, { Fragment, useEffect } from 'react'
import RapComment from './RapComment'
import { Box, CircularProgress, Divider } from '@mui/material'
import { api } from 'src/utils/api';
import { Virtuoso } from 'react-virtuoso';

interface RapCommentsProps {
  sortBy: 'POPULAR' | 'RECENT';
  rapId?: string;
}

function RapComments({ sortBy, rapId }: RapCommentsProps) {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch
  } = api.rapComment.getRapComments.useInfiniteQuery({
    rapId: rapId as string,
    sortBy,
    limit: 5,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    refetch();
  }, [sortBy, refetch])

  const rapCommentsData = data?.pages.flatMap(page => page.rapComments) ?? [];

  return (
    <Virtuoso
      style={{
        width: '100%',
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
        Footer: () => (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 3,
              height: 100,
            }}
          >
            {hasNextPage && (
              <CircularProgress color='inherit' size={20} />
            )}
          </Box>
        )
      }}
    />
  )
}

export default RapComments
