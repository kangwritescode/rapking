// ** React Imports
import { useState } from 'react';

// ** Next Import
import { useRouter } from 'next/router';

// ** MUI Components
import Grid from '@mui/material/Grid';

// ** Components
import { api } from 'src/utils/api';
import RapsTab from '../../../components/UserPage/RapsTab';
import UserProfileHeader from '../../../components/UserPage/UserProfileHeader';

const UserProfile = () => {
  const session = useSession();
  const router = useRouter();
  const theme = useTheme();

  const { username } = router.query;

  const { data: userData } = api.user.findByUsername.useQuery(
    { username: username as string },
    {
      enabled: Boolean(username)
    }
  );
  const { data: rapsData } = api.rap.getRapsByUser.useQuery({ userId: userData?.id || '' });
  const { data: currentUserData } = api.user.getCurrentUser.useQuery(undefined, {
    enabled: !!session.data?.user?.id
  });

  const isCurrentUser = currentUserData?.id === userData?.id;

  const [value, setValue] = useState('raps');

  const handleTabsChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader userData={userData} currentUserData={currentUserData} />
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
  );
};

export default UserProfile;

import { Tab, Tabs, useTheme } from '@mui/material';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import BioCard from 'src/components/UserPage/BioCard/BioCard';
import { appRouter } from 'src/server/api/root';
import { createTRPCContext } from 'src/server/api/trpc';
import superjson from 'superjson';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { username } = context.query;

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createTRPCContext(context),
    transformer: superjson
  });
  await helpers.user.findByUsername.prefetch({ username });

  return {
    props: {
      trpcState: helpers.dehydrate()
    }
  };
}
