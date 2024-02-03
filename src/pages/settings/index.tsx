import { Box, Stack, Typography, useTheme } from '@mui/material';

function SettingsPage() {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        py: `1rem`,
        px: {
          xs: '1rem',
          sm: '2rem',
          md: '4rem',
          lg: '8rem',
          xl: '12rem'
        },
        transition: 'padding .25s ease-in-out',
        [theme.breakpoints.down('sm')]: {
          paddingLeft: theme.spacing(4),
          paddingRight: theme.spacing(4)
        }
      }}
    >
      <Stack width={['100%']} mx='auto'>
        <Typography
          borderBottom={theme => `1px solid ${theme.palette.divider}`}
          variant='h3'
          component='h1'
          fontFamily='impact'
          mb='.5rem'
          pb='.25rem'
        >
          Account Settings
        </Typography>
        <Box
          sx={{
            marginTop: theme.spacing(2),
            width: {
              xs: '100%',
              lg: '50%'
            }
          }}
        >
          <Typography
            borderBottom={theme => `1px solid ${theme.palette.divider}`}
            variant='h4'
            component='h2'
            fontFamily='impact'
            mb='1rem'
            pb='.25rem'
          >
            Delete Account
          </Typography>
          <DeleteAccountButton />
        </Box>
      </Stack>
    </Stack>
  );
}

export default SettingsPage;

import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next/types';
import DeleteAccountButton from 'src/components/SettingsPage/DeleteAccountButton';

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);
  const redirectToCreateProfilePage =
    session && (!session?.user.profileIsComplete || !session?.user.isWhitelisted);

  if (redirectToCreateProfilePage) {
    return {
      redirect: {
        destination: '/create-profile/',
        permanent: false
      }
    };
  }

  return {
    props: {}
  };
};
