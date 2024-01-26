import { Box, Button, Divider, Stack, Theme, Typography, useMediaQuery } from '@mui/material';
import { Session } from 'next-auth';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import BoxOutlineButton from 'src/components/BoxOutlinedButton';
import BannerContainer from 'src/components/LandingPage/BannerContainer';
import LandingFooter from 'src/components/LandingPage/LandingFooter';
import LandingNav from 'src/components/LandingPage/LandingNav';
import LatestRapsSection from 'src/components/LandingPage/LatestRapsSection';
import { api } from 'src/utils/api';

const LandingPage = () => {
  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const router = useRouter();

  const { data: userData } = api.user.getCurrentUser.useQuery();

  if (userData?.username) {
    router.push(`/u/${userData.username}`);

    return null;
  }

  const checkOutButtonsData = [
    {
      title: 'West Coast',
      path: '/explore?us-country=WEST'
    },
    {
      title: 'East Coast',
      path: '/explore?us-country=EAST'
    }
  ];

  return (
    <Box>
      <LandingNav />
      <BannerContainer
        sx={{
          height: {
            xs: '26rem',
            md: '40rem'
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
              xs: '2.25rem',
              sm: '3rem',
              md: '4.5rem'
            }}
            mb='1rem'
            sx={{
              transition: 'font-size .25s ease-in-out'
            }}
          >
            Write. Judge. Discuss.
          </Typography>
          <BoxOutlineButton
            onClick={() => void signIn()}
            sx={{
              fontSize: {
                xs: '1rem',
                sm: '1.5rem'
              },
              padding: {
                xs: '.5rem 1.5rem',
                md: '1rem 2rem'
              }
            }}
          >
            {isTablet ? 'Join Rapking' : 'Join the RapKing Community'}
          </BoxOutlineButton>
          <Stack
            alignItems='center'
            direction={['column', 'row']}
            sx={{
              mt: {
                xs: '2rem',
                md: '2.5rem'
              }
            }}
          >
            <Typography
              component='span'
              mr='.25rem'
              mb={{
                xs: '.5rem',
                md: 'unset'
              }}
            >
              {' '}
              Check out bars from:{' '}
            </Typography>
            <Box>
              {checkOutButtonsData.map(({ title, path }) => {
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
                    onClick={() => router.push(path)}
                  >
                    {title}
                  </Button>
                );
              })}
            </Box>
          </Stack>
        </Stack>
      </BannerContainer>
      <LatestRapsSection />
      <Divider />
      <LandingFooter />
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const session: Session | null = await getSession(context);

  if (session?.user) {
    const username = session.user.username;
    if (username) {
      return {
        redirect: {
          destination: `/u/${username}`,
          permanent: false
        }
      };
    }
  }

  return {
    props: {} // will be passed to the page component as props
  };
};

export default LandingPage;

LandingPage.getLayout = (page: React.ReactNode) => page;
