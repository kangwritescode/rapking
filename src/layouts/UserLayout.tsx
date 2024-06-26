// ** React Imports
import { ReactNode, useEffect, useState } from 'react';

// ** MUI Imports
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// ** Layout Imports
// !Do not remove this Layout import
import Layout from 'src/@core/layouts/Layout';

// ** Navigation Imports
import AppBarContent from './components/vertical/AppBarContent';

// ** Hook Import
import { useSession } from 'next-auth/react';
import { useSettings } from 'src/@core/hooks/useSettings';
import { NavLink, NavSectionTitle } from 'src/@core/layouts/types';
import { api } from 'src/utils/api';

interface Props {
  children: ReactNode;
  contentHeightFixed?: boolean;
}

const UserLayout = ({ children, contentHeightFixed }: Props) => {
  const session = useSession();

  const { data: userData } = api.user.getCurrentUser.useQuery(undefined, {
    enabled: session.status === 'authenticated'
  });

  const { settings, saveSettings } = useSettings();

  const [showWriteItem, setShowWriteItem] = useState(false);

  useEffect(() => {
    if (session.status !== 'loading' && session.status === 'unauthenticated') {
      setShowWriteItem(true);
    }
  }, [session.status]);

  /**
   *  The below variable will hide the current layout menu at given screen size.
   *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
   *  You can change the screen size from which you want to hide the current layout menu.
   *  Please refer useMediaQuery() hook: https://mui.com/material-ui/react-use-media-query/,
   *  to know more about what values can be passed to this hook.
   *  ! Do not change this value unless you know what you are doing. It can break the template.
   */
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical';
  }

  const navItems: Array<NavLink | NavSectionTitle> = [
    {
      title: 'Explore',
      path: '/explore',
      icon: 'mdi:earth'
    },
    {
      title: 'Leaderboard',
      path: '/leaderboard',
      icon: 'ic:twotone-leaderboard'
    },
    {
      title: 'Competitions',
      path: '/royale',
      icon: 'ph:crown-bold'
    },
    {
      title: 'Forum',
      path: '/forum',
      icon: 'ic:sharp-forum'
    },
    {
      title: 'Insights',
      path: '/insights',
      icon: 'ph:brain-duotone'
    },
    {
      title: 'Discord',
      path: '/community',
      icon: 'ic:baseline-discord'
    }
  ];

  if (showWriteItem) {
    navItems.splice(2, 0, {
      title: 'Write',
      path: '/write',
      icon: 'ph:note-pencil-bold'
    });
  }

  if (userData) {
    navItems.splice(0, 0, {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'ic:sharp-dashboard'
    });
    navItems.splice(0, 0, {
      title: userData.username || 'Profile',
      path: `/u/${userData.username}`,
      icon: 'gg:profile'
    });
  }

  // Reports
  if (userData && userData.isAdmin) {
    navItems.push({
      title: 'Reports',
      path: '/reports',
      icon: 'ic:sharp-report'
    });
  }

  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      contentHeightFixed={contentHeightFixed}
      verticalLayoutProps={{
        navMenu: {
          navItems
        },
        appBar: {
          content: props => (
            <AppBarContent
              hidden={hidden}
              settings={settings}
              saveSettings={saveSettings}
              toggleNavVisibility={props.toggleNavVisibility}
            />
          )
        }
      }}
    >
      {children}
    </Layout>
  );
};

export default UserLayout;
