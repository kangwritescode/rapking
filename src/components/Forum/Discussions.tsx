import { Box, Pagination, Stack, SxProps, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { api } from 'src/utils/api';
import DiscussionCard from './DiscussionCard';

interface DiscussionsProps {
  sx?: SxProps;
}

const pageSize = 8;

function Discussions({ sx }: DiscussionsProps) {
  const theme = useTheme();
  const router = useRouter();

  const page = router.query.page ? parseInt(router.query.page as string) : 1;

  const { data } = api.thread.getDiscussionsPage.useQuery({
    limit: pageSize,
    page
  });

  const { data: pages } = api.thread.getForumThreadPages.useQuery({
    pageSize
  });

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`/forum?page=${value}`);
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
