// ** React Imports
import { useState } from 'react';

// ** Next Import
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

// ** MUI Components
import { Box, Tab, Tabs, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';

// ** Components
import { GetServerSidePropsContext } from 'next';
import BioCard from 'src/components/UserPage/BioCard/BioCard';
import { api } from 'src/utils/api';
import RapsTab from '../../../components/UserPage/RapsTab';
import UserProfileHeader from '../../../components/UserPage/UserProfileHeader';

const UserProfile = ({ userId }: { userId?: string }) => {
  const router = useRouter();
  const theme = useTheme();

  const { username } = router.query;

  // Get user that matches username
  const { data: userData } = api.user.findByUsername.useQuery(
    { username: username as string },
    {
      enabled: Boolean(username)
    }
  );

  // Check if current user is viewing their own profile
  const isCurrentUser = userData?.id === userId;

  const { data: rapsData } = api.rap.getRapsByUser.useQuery(
    { userId: userData?.id || '', publishedOnly: !isCurrentUser },
    {
      enabled: !!userData?.id && !!userId
    }
  );

  const [value, setValue] = useState('raps');

  const handleTabsChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        padding: `3rem 2rem`,
        transition: 'padding .25s ease-in-out',
        [theme.breakpoints.down('sm')]: {
          paddingLeft: theme.spacing(4),
          paddingRight: theme.spacing(4)
        }
      }}
    >
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <UserProfileHeader userData={userData} isCurrentUser={isCurrentUser} />
        </Grid>
        <Grid item xs={12} md={4}>
          <BioCard
            userData={userData}
            sx={{
              p: theme.spacing(5)
            }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Tabs
            value={value}
            onChange={handleTabsChange}
            textColor='primary'
            indicatorColor='primary'
          >
            <Tab value='raps' label='Raps' />
          </Tabs>
          {value === 'raps' && <RapsTab raps={rapsData} isCurrentUser={isCurrentUser} />}
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfile;

import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from 'src/server/api/root';
import { createTRPCContext } from 'src/server/api/trpc';
import superjson from 'superjson';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { username } = context.query;

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

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createTRPCContext(context),
    transformer: superjson
  });
  await helpers.user.findByUsername.prefetch({ username });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      userId: session?.user.id || null
    }
  };
}
