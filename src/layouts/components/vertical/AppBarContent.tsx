// ** MUI Imports
import { Icon } from '@iconify/react';
import { Button, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext';

// ** Components
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown';
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown';
import GlobalSearch from 'src/components/GlobalSearch';
import { api } from 'src/utils/api';

interface Props {
  hidden: boolean;
  settings: Settings;
  toggleNavVisibility: () => void;
  saveSettings: (values: Settings) => void;
}

const AppBarContent = (props: Props) => {
  // ** Props
  const { settings, toggleNavVisibility, hidden } = props;

  const { status } = useSession();
  const { data: profileIsComplete } = api.user.getProfileIsComplete.useQuery(undefined, {
    enabled: status === 'authenticated'
  });

  const router = useRouter();

  const isCreateProfilePage = router.pathname === '/create-profile';

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
      }}
    >
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {(!profileIsComplete && status === 'authenticated') || !hidden ? null : (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon icon='mdi:menu' />
          </IconButton>
        )}
      </Box>
      {router.asPath !== '/create-profile/' && (
        <GlobalSearch
          sx={{
            position: 'absolute',
            left: {
              md: '3.5rem',
              lg: 'unset'
            },
            display: {
              xs: 'none',
              md: 'block'
            }
          }}
        />
      )}
      {status === 'unauthenticated' && (
        <Stack direction='row'>
          <Button
            variant='outlined'
            onClick={() => router.push('/auth')}
            sx={{
              mr: '1rem'
            }}
          >
            Log in
          </Button>
          <Button variant='contained' onClick={() => router.push('/auth')}>
            Sign Up
          </Button>
        </Stack>
      )}
      {status === 'authenticated' && (
        <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
          {!isCreateProfilePage && (
            <Button
              sx={{
                textTransform: 'unset'
              }}
              color='inherit'
              variant='text'
              startIcon={<Icon icon='ph:note-pencil-bold' />}
              onClick={() => router.push('/write')}
            >
              Write
            </Button>
          )}
          {!isCreateProfilePage && <NotificationDropdown settings={settings} />}
          <UserDropdown settings={settings} />
        </Box>
      )}
    </Box>
  );
};

export default AppBarContent;
