// ** React Imports
import { ElementType } from 'react';

// ** Next Imports
import Link from 'next/link';
import { useRouter } from 'next/router';

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import ListItem from '@mui/material/ListItem';
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// ** Configs Import
import themeConfig from 'src/configs/themeConfig';

// ** Types
import { Settings } from 'src/@core/context/settingsContext';
import { NavGroup, NavLink } from 'src/@core/layouts/types';

// ** Custom Components Imports
import Translations from 'src/layouts/components/Translations';
import UserIcon from 'src/layouts/components/UserIcon';

// ** Util Import
import { Avatar } from '@mui/material';
import { useSession } from 'next-auth/react';
import { handleURLQueries } from 'src/@core/layouts/utils';
import { BUCKET_URL } from 'src/shared/constants';
import { api } from 'src/utils/api';

interface Props {
  parent?: boolean;
  item: NavLink;
  navHover?: boolean;
  settings: Settings;
  navVisible?: boolean;
  collapsedNavWidth: number;
  navigationBorderWidth: number;
  toggleNavVisibility: () => void;
  isSubToSub?: NavGroup | undefined;
}

// ** Styled Components
const MenuNavLink = styled(ListItemButton)<
  ListItemButtonProps & { component?: ElementType; href: string; target?: '_blank' | undefined }
>(({ theme }) => ({
  width: '100%',
  borderTopRightRadius: 100,
  borderBottomRightRadius: 100,
  color: theme.palette.text.primary,
  transition: 'padding-left .25s ease-in-out',
  '&.active': {
    '&, &:hover': {
      boxShadow: theme.shadows[3],
      backgroundImage: `linear-gradient(98deg, ${theme.palette.customColors.primaryGradient}, ${theme.palette.primary.main} 94%)`
    },
    '& .MuiTypography-root, & .MuiListItemIcon-root': {
      color: `${theme.palette.common.white} !important`
    }
  }
}));

const MenuItemTextMetaWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
}));

const VerticalNavLink = ({
  item,
  parent,
  navHover,
  settings,
  navVisible,
  isSubToSub,
  collapsedNavWidth,
  toggleNavVisibility,
  navigationBorderWidth
}: Props) => {
  // ** Hooks
  const router = useRouter();

  // ** Vars
  const { navCollapsed } = settings;

  // ** Session
  const { data: sessionData, status } = useSession();

  const { data: userData } = api.user.getCurrentUser.useQuery(undefined, {
    enabled: !!sessionData?.user?.id
  });

  const isProfileIcon = item.path?.includes('/u/');
  const showUserIcon = status === 'authenticated' && userData?.profileImageUrl && isProfileIcon;

  const icon = parent && !item.icon ? themeConfig.navSubItemIcon : item.icon;

  const isNavLinkActive = () => {
    if (
      router.pathname === item.path ||
      handleURLQueries(router, item.path) ||
      item.path?.includes('username')
    ) {
      return true;
    } else {
      return false;
    }
  };

  const menuNavLinkHref = item.path === undefined ? '/' : `${item.path}`;

  return (
    <ListItem
      disablePadding
      className='nav-link'
      disabled={item.disabled || false}
      sx={{ mt: 1.5, px: '0 !important' }}
    >
      <MenuNavLink
        component={Link}
        {...(item.disabled && { tabIndex: -1 })}
        className={isNavLinkActive() ? 'active' : ''}
        href={menuNavLinkHref}
        {...(item.openInNewTab ? { target: '_blank' } : null)}
        onClick={e => {
          if (item.path === undefined) {
            e.preventDefault();
            e.stopPropagation();
          }
          if (item.path?.includes('community')) {
            e.preventDefault();
            e.stopPropagation();
            window.open('https://discord.gg/zxCrUhvq', '_blank');
          }
          if (navVisible) {
            toggleNavVisibility();
          }
        }}
        sx={{
          py: 2.25,
          ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' }),
          pl:
            navCollapsed && !navHover ? (collapsedNavWidth - navigationBorderWidth - 24) / 8 : 5.5,
          pr:
            navCollapsed && !navHover
              ? ((collapsedNavWidth - navigationBorderWidth - 24) / 2 - 5) / 4
              : 3.5
        }}
      >
        {isSubToSub ? null : (
          <ListItemIcon
            sx={{
              color: 'text.primary',
              transition: 'margin .25s ease-in-out',
              ...(navCollapsed && !navHover ? { mr: 0 } : { mr: 2.5 }),
              ...(parent ? { ml: 1.25, mr: 3.75 } : {}), // This line should be after (navCollapsed && !navHover) condition for proper styling
              '& svg': {
                fontSize: '0.875rem',
                ...(!parent ? { fontSize: '1.5rem' } : {}),
                ...(parent && item.icon ? { fontSize: '0.875rem' } : {})
              }
            }}
          >
            {showUserIcon ? (
              <Avatar
                sx={{
                  width: 26,
                  height: 26
                }}
                {...(userData?.profileImageUrl
                  ? { src: `${BUCKET_URL}/${userData?.profileImageUrl}` }
                  : {})}
              />
            ) : (
              <UserIcon icon={icon as string} />
            )}
          </ListItemIcon>
        )}

        <MenuItemTextMetaWrapper
          sx={{
            ...(isSubToSub ? { ml: 9 } : {}),
            ...(navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 })
          }}
        >
          <Typography
            {...((themeConfig.menuTextTruncate ||
              (!themeConfig.menuTextTruncate && navCollapsed && !navHover)) && {
              noWrap: true
            })}
          >
            <Translations text={item.title} />
          </Typography>
          {item.badgeContent ? (
            <Chip
              label={item.badgeContent}
              color={item.badgeColor || 'primary'}
              sx={{
                height: 20,
                fontWeight: 500,
                '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
              }}
            />
          ) : null}
        </MenuItemTextMetaWrapper>
      </MenuNavLink>
    </ListItem>
  );
};

export default VerticalNavLink;
