import React, { Fragment } from 'react'
import RapComment from './RapComment'
import { Divider } from '@mui/material'
import { api } from 'src/utils/api';

interface RapCommentsProps {
  sortBy: 'POPULAR' | 'RECENT';
  rapId?: string;
}

function RapComments({ sortBy, rapId }: RapCommentsProps) {
  const { data: rapComments } = api.rapComment.getRapComments.useQuery({
    rapId: rapId as string,
    sortBy,
    page: 0,
    pageSize: 10,
  }, {
    enabled: !!rapId,
  });

  return rapComments?.map((comment) =>
    <Fragment key={comment.id}>
      <RapComment
        sx={{
          py: 5
        }}
        comment={comment}
      />
      <Divider />
    </Fragment>
  )
}

export default RapComments
