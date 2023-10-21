import React, { Fragment, useEffect } from 'react'
import RapComment from './RapComment'
import { Divider } from '@mui/material'
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
    limit: 6,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  // Reset state when filters change
  useEffect(() => {
    refetch();
  }, [sortBy, refetch])

  const rapCommentsData = data?.pages.flatMap(page => page.rapComments) ?? [];

  const ids = new Set();
  const hasDuplicates = rapCommentsData.some((comment) => {
    if (ids.has(comment.id)) {
      console.warn("Duplicate comment ID:", comment.id);

      return true;
    }
    ids.add(comment.id);

    return false;
  });

  console.log("hasDuplicates:", hasDuplicates);
  console.log(rapCommentsData.map((comment) => comment));

  return (
    <Virtuoso
      style={{
        width: '100%',
      }}
      data={rapCommentsData}
      totalCount={rapCommentsData.length}
      endReached={() => {
        console.log('fetching next page')
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      overscan={400}
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
    />
  )
}

export default RapComments
