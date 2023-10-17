import React, { Fragment } from 'react'
import RapComment from './RapComment'
import { Divider } from '@mui/material'
import { RapCommentWithUserData } from 'src/server/api/routers/rapComment'

interface RapCommentsProps {
  rapComments?: RapCommentWithUserData[] | null
}

function RapComments({ rapComments }: RapCommentsProps) {
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
