import { Icon } from '@iconify/react';
import { Box, Divider, Drawer, IconButton, MenuItem, Select, Typography } from '@mui/material'
import React, { Fragment, useState } from 'react'
import RapCommentComposer from './RapCommentComposer';
import { api } from 'src/utils/api';
import RapComment from './RapComment';

interface RapCommentDrawerProps {
  onCloseHandler: () => void;
  isOpen: boolean;
  rapId?: string;
}

function RapCommentDrawer({
  onCloseHandler,
  isOpen,
  rapId
}: RapCommentDrawerProps) {

  const [sortBy, setSortBy] = useState<'POPULAR' | 'RECENT'>('POPULAR');

  const { data: rapComments } = api.rapComment.getRapComments.useQuery({
    rapId: rapId as string,
    sortBy,
  }, {
    enabled: !!rapId,
  });


  return (
    <Drawer
      anchor='right'
      open={isOpen}
      onClose={onCloseHandler}
    >
      <Box

        width='24rem'
        maxWidth='24rem'
        px={6}
        pt={6}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            Comments {rapComments?.length ? `(${rapComments?.length})` : ''}
          </Typography>
          <IconButton onClick={onCloseHandler}>
            <Icon icon="mdi:close" />
          </IconButton>
        </Box>
        <RapCommentComposer rapId={rapId} />
        <Select
          defaultValue="ALL"
          sx={{
            mt: 12,
            ml: -2,
            ".MuiOutlinedInput-notchedOutline": {
              border: 'none',
            },
          }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'POPULAR' | 'RECENT')}
        >
          <MenuItem value="POPULAR">Most popular</MenuItem>
          <MenuItem value="RECENT">Most recent</MenuItem>
        </Select>
      </Box>
      <Divider sx={{
        mb: 4
      }} />
      <Box
        width="24rem"
        maxWidth='24rem'
        px={5}>
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
      </Box>
    </Drawer>
  )
}

export default RapCommentDrawer
