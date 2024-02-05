import { Icon } from '@iconify/react';
import { Box, Divider, Drawer, IconButton, MenuItem, Select, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { api } from 'src/utils/api';
import RapCommentComposer from './RapCommentComposer';
import RapComments from './RapComments';

interface RapCommentDrawerProps {
  onCloseHandler: () => void;
  isOpen: boolean;
  rapId?: string;
}

function RapCommentDrawer({ onCloseHandler, isOpen, rapId }: RapCommentDrawerProps) {
  const { commentId } = useRouter().query;

  const [sortBy, setSortBy] = useState<'POPULAR' | 'RECENT'>(commentId ? 'RECENT' : 'POPULAR');

  const { data: rapCommentsCount } = api.threadComments.getThreadCommentsCount.useQuery(
    {
      rapId: rapId as string
    },
    {
      enabled: !!rapId
    }
  );

  const { data: thread } = api.thread.getThread.useQuery(
    { rapId: rapId as string },
    {
      enabled: !!rapId
    }
  );

  return (
    <Drawer anchor='right' open={isOpen} onClose={onCloseHandler}>
      <Box width='24rem' maxWidth='24rem' px={6} pt={6}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h6'>
            Comments {rapCommentsCount ? `(${rapCommentsCount})` : ''}
          </Typography>
          <IconButton onClick={onCloseHandler}>
            <Icon icon='mdi:close' />
          </IconButton>
        </Box>
        <RapCommentComposer threadId={thread?.id} />
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
      <Box width='24rem' maxWidth='24rem' height='100%' px={5}>
        <RapComments threadId={thread?.id} sortBy={sortBy} />
      </Box>
    </Drawer>
  );
}

export default RapCommentDrawer;
