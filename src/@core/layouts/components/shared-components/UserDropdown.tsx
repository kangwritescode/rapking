// ** React Imports
import { useState, SyntheticEvent, Fragment } from 'react';

// ** Next Import
import { useRouter } from 'next/router';

// ** MUI Imports
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// ** Icon Imports
import { Icon } from '@iconify/react';

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext';
import { signOut, useSession } from 'next-auth/react';
import { api } from 'src/utils/api';
import { BUCKET_URL } from 'src/shared/constants';

interface Props {
  settings: Settings;
}

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}));

const UserDropdown = (props: Props) => {
  // ** Auth
  const session = useSession();

  // ** Props
  const { settings } = props;

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  // ** Hooks
  const router = useRouter();

  // ** Vars
  const { direction } = settings;

  // ** Query
  const { data: userData } = api.user.getCurrentUser.useQuery(undefined, {
    enabled: !!session.data?.user?.id
  });

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url);
    }
    setAnchorEl(null);
  };

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2,
      fontSize: '1.375rem',
      color: 'text.primary'
    }
  };

  const handleLogout = () => {
    handleDropdownClose();
    signOut({ callbackUrl: '/' });
  };

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Avatar
          alt='User Name'
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          {...(userData?.profileImageUrl && {
            src: `${BUCKET_URL}/${userData.profileImageUrl}`
          })}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Avatar
                alt='Profile avatar */'
                {...(userData?.profileImageUrl && {
                  src: `${BUCKET_URL}/${userData.profileImageUrl}`
                })}
                sx={{ width: '2.5rem', height: '2.5rem' }}
              />
            </Badge>
            <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{userData?.username || ''}</Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <MenuItem
          sx={{ p: 0 }}
          onClick={() => {
            handleDropdownClose();
            router.push('/settings');
          }}
        >
          <Box sx={styles}>
            <Icon icon='mdi:cog-outline' />
            Settings
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}
        >
          <Icon icon='mdi:logout-variant' />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default UserDropdown;
