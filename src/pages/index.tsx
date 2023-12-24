import { Box, Button, Stack, Theme, Typography, useMediaQuery } from '@mui/material';
import { signIn } from 'next-auth/react';
import BoxOutlineButton from 'src/components/BoxOutlinedButton';
import BannerContainer from 'src/components/LandingPage/BannerContainer';
import LandingNav from 'src/components/LandingPage/LandingNav';

const Home = () => {
  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const checkOutButtonsData = [
    {
      title: 'West Coast',
      path: '/explore'
    },
    {
      title: 'East Coast',
      path: '/explore'
    }
  ];

  return (
    <Box>
      <LandingNav />
      <BannerContainer
        sx={{
          height: {
            xs: '20rem',
            sm: '25rem',
            md: '36rem'
          }
        }}
      >
        <Stack
          sx={{
            position: 'relative',
            zIndex: 5,
            width: {
              xs: '100%',
              md: 'fit-content'
            },
            left: {
              xs: 'unset',
              md: '16%'
            },
            alignItems: {
              xs: 'center',
              md: 'flex-start'
            }
          }}
        >
          <Typography
            component='h1'
            color='grey.200'
            fontFamily='impact'
            fontSize={{
              xs: '3rem',
              md: '4.5rem'
            }}
            mb='1rem'
          >
            Write. Judge. Discuss.
          </Typography>
          <BoxOutlineButton
            onClick={() => void signIn()}
            sx={{
              fontSize: {
                xs: '1.5rem'
              },
              padding: {
                xs: '.5rem 1.5rem',
                md: '1rem 2rem'
              }
            }}
          >
            {isTablet ? 'Join Rapking' : 'Join the RapKing Community'}
          </BoxOutlineButton>
          <Stack direction='row' mt='2.5rem' alignItems='center'>
            <Typography component='span' mr='.25rem'>
              {' '}
              Check out bars from:{' '}
            </Typography>
            {checkOutButtonsData.map(({ title }) => {
              return (
                <Button
                  key={title}
                  size='small'
                  variant='outlined'
                  color='inherit'
                  sx={theme => ({
                    borderRadius: '1rem',
                    ml: '.75rem',
                    border: `2px solid ${theme.palette.grey[600]}`,
                    color: 'white',
                    background: theme.palette.grey[900],
                    textTransform: 'none'
                  })}
                >
                  {title}
                </Button>
              );
            })}
          </Stack>
        </Stack>
      </BannerContainer>
    </Box>
  );
};

export default Home;

Home.getLayout = (page: React.ReactNode) => page;
