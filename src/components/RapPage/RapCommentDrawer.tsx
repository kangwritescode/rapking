import { Icon } from '@iconify/react';
import { Box, Divider, Drawer, IconButton, MenuItem, Select, Typography } from '@mui/material';
import { Rap } from '@prisma/client';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { api } from 'src/utils/api';
import RapCommentComposer from './RapCommentComposer';
import RapComments from './RapComments';

interface RapCommentDrawerProps {
  onCloseHandler: () => void;
  isOpen: boolean;
  rapData?: Rap | null;
  threadId?: string | null;
}

function RapCommentDrawer({ onCloseHandler, isOpen, threadId }: RapCommentDrawerProps) {
  const { commentId } = useRouter().query;

  const [sortBy, setSortBy] = useState<'POPULAR' | 'RECENT'>(commentId ? 'RECENT' : 'POPULAR');

  const { data: rapCommentsCount } = api.threadComments.getThreadCommentsCount.useQuery(
    {
      id: threadId as string
    },
    {
      enabled: !!threadId
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
      <Box width='24rem' maxWidth='24rem' height='100%' px={5}>
        <RapComments threadId={threadId} sortBy={sortBy} />
      </Box>
    </Drawer>
  );
}

export default RapCommentDrawer;
