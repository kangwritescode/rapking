// ** React Imports
import { ReactNode } from 'react';

// ** MUI Imports
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// ** Layout Imports
// !Do not remove this Layout import
import Layout from 'src/@core/layouts/Layout';

// ** Navigation Imports
import VerticalAppBarContent from './components/vertical/AppBarContent';

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings';
import { api } from 'src/utils/api';
import { useSession } from 'next-auth/react';

interface Props {
  children: ReactNode;
  contentHeightFixed?: boolean;
}

const UserLayout = ({ children, contentHeightFixed }: Props) => {
  const session = useSession();

  const { data: userData } = api.user.getCurrentUser.useQuery(undefined, {
    enabled: !!session.data?.user?.id
  });
  const { settings, saveSettings } = useSettings();

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

  const navItems = [
    {
      title: 'Explore',
      path: '/explore',
      icon: 'mdi:earth'
    },
    {
      title: 'Write',
      path: '/write',
      icon: 'ph:note-pencil-bold'
    },
    {
      title: 'Leaderboard',
      path: '/leaderboard',
      icon: 'ph:crown-bold'
    }
  ];

  if (userData) {
    navItems.splice(0, 0, {
      title: userData.username || 'Profile',
      path: `/u/${userData.username}`,
      icon: 'gg:profile'
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
            <VerticalAppBarContent
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
