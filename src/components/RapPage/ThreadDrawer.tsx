import { Icon } from '@iconify/react';
import { Box, Divider, Drawer, IconButton, MenuItem, Select, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { api } from 'src/utils/api';
import RapCommentComposer from './ThreadCommentComposer';
import RapComments from './ThreadComments';

interface ThreadDrawerProps {
  onCloseHandler: () => void;
  isOpen: boolean;
  threadId?: string | null;
}

function ThreadDrawer({ onCloseHandler, isOpen, threadId }: ThreadDrawerProps) {
  const { commentId } = useRouter().query;

  const [sortBy, setSortBy] = useState<'POPULAR' | 'RECENT'>(commentId ? 'RECENT' : 'POPULAR');

  const { data: threadCommentsCount } = api.threadComments.getThreadCommentsCount.useQuery(
    {
      id: threadId as string
    },
    {
      enabled: !!threadId
    }
  );

  return (
    <Drawer anchor='right' open={isOpen} onClose={onCloseHandler}>
      <Box px={6} pt={6}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h6'>
            Comments {threadCommentsCount ? `(${threadCommentsCount})` : ''}
          </Typography>
          <IconButton onClick={onCloseHandler}>
            <Icon icon='mdi:close' />
          </IconButton>
        </Box>
        <RapCommentComposer threadId={threadId} />
        <Select
          defaultValue='ALL'
          sx={{
            mt: 12,
            ml: -2,
            '.MuiOutlinedInput-notchedOutline': {
              border: 'none'
            }
          }}
          value={sortBy}
          onChange={e => setSortBy(e.target.value as 'POPULAR' | 'RECENT')}
        >
          <MenuItem value='POPULAR'>Most popular</MenuItem>
          <MenuItem value='RECENT'>Most recent</MenuItem>
        </Select>
      </Box>
      <Divider
        sx={{
          mb: 4
        }}
      />
      <Box
        width={{
          xs: '24rem',
          md: '28rem'
        }}
        maxWidth='100%'
        height='100%'
        px={5}
      >
        <RapComments threadId={threadId} sortBy={sortBy} />
      </Box>
    </Drawer>
  );
}

export default ThreadDrawer;
