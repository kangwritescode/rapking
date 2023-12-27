// ** React Imports
import { useState } from 'react';

// ** Next Import
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

// ** MUI Components
import { Box, Tab, Tabs, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';

// ** Components
import BioCard from 'src/components/UserPage/BioCard/BioCard';
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
    </Box>
  );
};

export default UserProfile;
