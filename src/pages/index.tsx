import { Icon } from '@iconify/react';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import BoxOutlineButton from 'src/components/BoxOutlinedButton';
import BannerContainer from 'src/components/LandingPage/BannerContainer';

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

const NavBar = () => {
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
      px='2rem'
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
            ml: '0.5rem'
          }}
        >
          RapKing
        </Typography>
      </Stack>
      <Stack direction='row' alignItems='center' justifyContent='space-evenly' width='34rem'>
        {navButtons.map(({ title, path }) => {
          const onClick = path === '/forum' ? () => void signIn() : () => router.push(path);

          return (
            <Button
              key={title}
              sx={{
                color: theme.palette.text.primary,
                textTransform: 'none',
                fontSize: '1rem',
                mr: '.5rem'
              }}
              onClick={onClick}
            >
              {title}
            </Button>
          );
        })}
      </Stack>
      <Button variant='contained' onClick={() => void signIn()}>
        Sign In
      </Button>
    </Stack>
  );
};

const Home = () => {
  return (
    <Box>
      <NavBar />
      <BannerContainer
        sx={{
          height: '36rem'
        }}
      >
        <Stack
          sx={{
            position: 'relative',
            zIndex: 5,
            width: 'fit-content',
            left: {
              xs: '16%'
            },
            alignItems: 'left'
          }}
        >
          <Typography
            component='h1'
            color='grey.200'
            fontFamily='impact'
            fontSize='4.5rem'
            mb='1rem'
          >
            Write. Judge. Discuss.
          </Typography>
          <BoxOutlineButton onClick={() => void signIn()}>
            Join the RapKing Community
          </BoxOutlineButton>
        </Stack>
      </BannerContainer>
    </Box>
  );
};

export default Home;

Home.getLayout = (page: React.ReactNode) => page;
