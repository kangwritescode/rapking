import { Icon } from '@iconify/react';
import { Box, Divider, IconButton, MenuItem, Select, SxProps, Typography } from '@mui/material';
import { useState } from 'react';
import { api } from 'src/utils/api';
import ThreadCommentComposer from '../RapPage/ThreadCommentComposer';
import ThreadComments from '../RapPage/ThreadComments';

interface RapThreadDrawerProps {
  sortByDefaultValue: 'POPULAR' | 'RECENT';
  threadId?: string | null;
  closeButtonClickHandler?: () => void;
  sx?: SxProps;
}

function RapThread({
  sortByDefaultValue,
  threadId,
  closeButtonClickHandler,
  sx
}: RapThreadDrawerProps) {
  const [sortBy, setSortBy] = useState<'POPULAR' | 'RECENT'>(sortByDefaultValue);

  const { data: threadCommentsCount } = api.threadComments.getThreadCommentsCount.useQuery(
    {
      id: threadId as string
    },
    {
      enabled: !!threadId
    }
  );

  return (
    <>
      <Box sx={sx}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h6'>
            Comments {threadCommentsCount ? `(${threadCommentsCount})` : ''}
          </Typography>
          {closeButtonClickHandler ? (
            <IconButton onClick={closeButtonClickHandler}>
              <Icon icon='mdi:close' />
            </IconButton>
          ) : undefined}
        </Box>
        <ThreadCommentComposer threadId={threadId} />
        <Select
          defaultValue='ALL'
          sx={{
            mt: 2,
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
        <ThreadComments threadId={threadId} sortBy={sortBy} />
      </Box>
    </>
  );
}

export default RapThread;
