// ** React Imports
import { useState } from 'react';

// ** Next Import
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

// ** MUI Components
import { Card, CardContent, Divider, Stack, Tab, Tabs, useTheme } from '@mui/material';

// ** Components
import { GetServerSidePropsContext } from 'next';
import { api } from 'src/utils/api';
import ProfileCard from '../../../components/UserPage/ProfileCard';
import RapsTab from '../../../components/UserPage/RapsTab';

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

  const { data: rapsData } = api.rap.getRapsByUser.useQuery({
    userId: userData?.id || '',
    publishedOnly: true
  });

  const [value, setValue] = useState('raps');

  const handleTabsChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Stack
      direction={{ sm: 'column', md: 'row' }}
      gap={4}
      sx={{
        padding: {
          xs: `1.5rem`,
          md: `1.5rem 1.5rem 0`
        },
        transition: 'padding .25s ease-in-out',
        [theme.breakpoints.down('sm')]: {
          paddingLeft: theme.spacing(4),
          paddingRight: theme.spacing(4)
        },
        height: `100%`
      }}
    >
      <Stack
        width={{
          xs: '100%',
          md: '24rem'
        }}
        maxWidth={'24rem'}
        minWidth={{
          xs: '100%',
          md: '24rem'
        }}
        sx={{
          transition: 'width .25s ease-in-out'
        }}
      >
        <ProfileCard userData={userData} isCurrentUser={isCurrentUser} />
      </Stack>
      <Stack flexGrow={1} gap='.5rem' height='100%'>
        <Card
          sx={{
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <CardContent>
            <ProfileCardStats userData={userData} />
          </CardContent>
        </Card>
        <Stack p='.5rem' position='relative' height={{ xs: '36rem', md: 'calc(100% - 6.75rem)' }}>
          <Tabs
            value={value}
            onChange={handleTabsChange}
            textColor='primary'
            indicatorColor='primary'
          >
            <Tab value='raps' label='Raps' />
            <Tab value='wall' label='Wall' />
          </Tabs>
          <Divider
            sx={{
              borderBottom: `2px solid ${theme.palette.divider}`,
              position: 'relative',
              top: '-2px'
            }}
          />
          {value === 'raps' && <RapsTab sx={{}} raps={rapsData} isCurrentUser={isCurrentUser} />}
          {value === 'wall' && <Wall threadId={userData?.wall?.threadId} />}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default UserProfile;

import { createServerSideHelpers } from '@trpc/react-query/server';
import ProfileCardStats from 'src/components/UserPage/ProfileCardStats';
import Wall from 'src/components/Wall/Wall';
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
