import { Box, Pagination, Stack, SxProps, Typography, useTheme } from '@mui/material';
import React from 'react';
import { api } from 'src/utils/api';
import DiscussionCard from './DiscussionCard';

interface DiscussionsProps {
  sx?: SxProps;
}

const pageSize = 8;

function Discussions({ sx }: DiscussionsProps) {
  const theme = useTheme();

  const [page, setPage] = React.useState(1);

  const { data } = api.thread.getDiscussionsPage.useQuery({
    limit: pageSize,
    page
  });

  const { data: pages } = api.thread.getForumThreadPages.useQuery({
    pageSize: 5
  });

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Stack
      sx={{
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        ...sx
      }}
    >
      <Box
        sx={{
          p: '.75rem 1rem',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Typography fontWeight='600'>All Discussions</Typography>
      </Box>
      {data?.map(thread => (
        <DiscussionCard key={thread.id} forumThread={thread} />
      ))}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          p: '1rem'
        }}
      >
        <Pagination count={pages} page={page} onChange={handlePageChange} />
      </Box>
    </Stack>
  );
}

export default Discussions;
