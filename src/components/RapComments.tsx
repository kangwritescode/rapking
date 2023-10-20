import React, { Fragment, useCallback, useEffect, useState } from 'react'
import RapComment from './RapComment'
import { Box, Divider } from '@mui/material'
import { api } from 'src/utils/api';
import { RapCommentWithUserData } from 'src/server/api/routers/rapComment';
import { useInView } from 'react-intersection-observer';
import FallbackSpinner from 'src/@core/components/spinner';

interface RapCommentsProps {
  sortBy: 'POPULAR' | 'RECENT';
  rapId?: string;
}

function RapComments({ sortBy, rapId }: RapCommentsProps) {

  const { ref, inView } = useInView();

  const [areMoreToLoad, setAreMoreToLoad] = useState(true);
  const [page, setPage] = useState(0);
  const [rapComments, setRapComments] = useState<RapCommentWithUserData[]>([]);

  const { refetch } = api.rapComment.getRapComments.useQuery({
    rapId: rapId as string,
    sortBy,
    page,
    pageSize: 6,
  }, {
    enabled: !!rapId,
  });

  const loadNextPage = useCallback(async () => {
    const { status, data: rapCommentsData } = await refetch();
    if (status === 'success') {
      if (rapCommentsData.length) {
        setRapComments((prevRaps) => [...prevRaps, ...rapCommentsData]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setAreMoreToLoad(false);
      }
    }
  }, [refetch])

  // Load initial page
  useEffect(() => {
    if (!rapComments.length && areMoreToLoad) {
      loadNextPage();
    }
  }, [loadNextPage, rapComments, areMoreToLoad])

  // Load next page when inView
  useEffect(() => {
    if (inView && areMoreToLoad) {
      loadNextPage();
    }
  }, [inView, areMoreToLoad, loadNextPage])

  // Reset state when filters change
  useEffect(() => {
    setPage(0);
    setRapComments([]);
    setAreMoreToLoad(true);
  }, [sortBy])

  return <>
    {rapComments?.map((comment) =>
      <Fragment key={comment.id}>
        <RapComment
          sx={{
            py: 5
          }}
          comment={comment}
        />
        <Divider />
      </Fragment>
    )}
    <Box ref={ref} height='100px'>
      {inView && areMoreToLoad && <FallbackSpinner sx={{ height: '100px' }} />}
    </Box>
  </>
}

export default RapComments
