import { Icon } from '@iconify/react';
import { Button, Stack, Typography, useTheme } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

const navButtons = [
  {
    title: 'Explore',
    path: '/explore'
  },
  {
    title: 'Write',
    path: '/write'
  },
  {
    title: 'Leaderboard',
    path: '/leaderboard'
  },
  {
    title: 'Forum',
    path: '/forum'
  }
];

const LandingNav = () => {
  const theme = useTheme();

  const router = useRouter();

  return (
    <Stack
      width='100%'
      height='4em'
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      position='relative'
      sx={{
        px: {
          xs: '1rem',
          md: '2rem'
        }
      }}
    >
      <Stack direction='row' alignItems='center'>
        <Icon icon='tabler:crown' color={theme.palette.secondary.main} fontSize='1.5rem' />
        <Typography
          variant='h6'
          sx={{
            fontWeight: 600,
            lineHeight: 'normal',
            textTransform: 'uppercase',
            color: theme.palette.text.primary,
            transition: 'opacity .25s ease-in-out, margin .25s ease-in-out',
            ml: '0.5rem',
            display: {
              xs: 'none',
              md: 'block'
            }
          }}
        >
          RapKing
        </Typography>
      </Stack>
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='space-evenly'
        sx={{
          width: {
            md: '34rem'
          }
        }}
      >
        {navButtons.map(({ title, path }) => {
          const onClick = path === '/forum' ? () => void signIn() : () => router.push(path);

          return (
            <Button
              key={title}
              sx={{
                color: theme.palette.text.primary,
                textTransform: 'none',
                fontSize: '1rem',
                mr: {
                  sm: 0,
                  md: '.5rem'
                }
              }}
              onClick={onClick}
            >
              {title}
            </Button>
          );
        })}
      </Stack>
      <Button
        variant='contained'
        onClick={() => void signIn()}
        sx={{
          display: {
            xs: 'none',
            md: 'block'
          }
        }}
      >
        Sign In
      </Button>
    </Stack>
  );
};

export default LandingNav;
