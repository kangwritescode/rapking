import { Box, Button, Divider, Stack, Theme, Typography, useMediaQuery } from '@mui/material';
import { Rap, User } from '@prisma/client';
import { useRouter } from 'next/router';
import BoxOutlineButton from 'src/components/BoxOutlinedButton';
import Footer from 'src/components/Footer';
import BannerContainer from 'src/components/LandingPage/BannerContainer';
import LandingNav from 'src/components/LandingPage/LandingNav';
import LatestRapsSection from 'src/components/LandingPage/LatestRapsSection';
import { Collaborator } from 'src/components/WritePage/RapEditor';
import { prisma } from 'src/server/db';
import { api } from 'src/utils/api';

interface LandingPageProps {
  raps: (Rap & { user: Partial<User>; collaborators: Array<Collaborator> })[];
}

const LandingPage = ({ raps }: LandingPageProps) => {
  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const router = useRouter();

  const { data: userData } = api.user.getCurrentUser.useQuery();

  if (userData?.username) {
    router.push(`/u/${userData.username}`);

    return null;
  }

  const checkOutButtonsData = [
    {
      title: 'United States',
      path: '/explore?country=US'
    },
    {
      title: 'United Kingdom',
      path: '/explore?country=UK'
    }
  ];

  return (
    <Box>
      <LandingNav />
      <Divider />
      <BannerContainer
        sx={{
          height: {
            xs: '20rem',
            md: '30rem'
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
            onClick={() => router.push('/auth')}
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
      <LatestRapsSection raps={raps} />
      <Divider />
      <Footer />
    </Box>
  );
};

export default LandingPage;

LandingPage.getLayout = (page: React.ReactNode) => page;

export async function getStaticProps() {
  const raps = await prisma.rap.findMany({
    orderBy: {
      dateCreated: 'desc'
    },
    take: 2,
    include: {
      user: true,
      collaborators: true
    }
  });

  const serializableRaps = JSON.parse(JSON.stringify(raps));

  return {
    props: {
      raps: serializableRaps
    }
  };
}
