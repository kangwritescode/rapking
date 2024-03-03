import { Icon } from '@iconify/react';
import { Box, Button, Divider, Typography, useTheme } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ForumThreadForm from './ForumThreadForm';

function ForumThreadCreator() {
  const theme = useTheme();

  const session = useSession();
  const isAuthenticated = session.status === 'authenticated';

  const router = useRouter();

  const [view, setView] = useState<'button' | 'creator'>('button');

  return view === 'button' ? (
    <Button
      onClick={() => {
        if (isAuthenticated) {
          setView('creator');
        } else {
          router.push('/auth');
        }
      }}
      startIcon={<Icon icon='mdi:forum' />}
      variant='outlined'
    >
      Start a new Discussion
    </Button>
  ) : (
    <Box
      sx={{
        background: theme.palette.background.paper
      }}
    >
      <Box
        sx={{
          p: '.75rem 1rem'
        }}
      >
        <Typography fontWeight='600'>Start a New Discussion</Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          p: '1rem'
        }}
      >
        <ForumThreadForm
          cancelButtonOnClick={() => {
            setView('button');
          }}
          onSuccess={() => setView('button')}
        />
      </Box>
    </Box>
  );
}

export default ForumThreadCreator;
