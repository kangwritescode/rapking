// ** React Imports
import { useState } from 'react';

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { styled } from '@mui/material/styles';

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig';

// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types';

// ** Components
import { Icon } from '@iconify/react';
import { useSession } from 'next-auth/react';
import ScrollToTop from 'src/@core/components/scroll-to-top';
import Footer from './components/shared-components/footer';
import AppBar from './components/vertical/appBar';
import Navigation from './components/vertical/navigation';

const VerticalLayoutWrapper = styled('div')({
  height: '100%',
  display: 'flex'
});

const MainContentWrapper = styled(Box)<BoxProps>({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
});

const ContentWrapper = styled('main')(() => ({
  flexGrow: 1,
  width: '100%'
}));

const VerticalLayout = (props: LayoutProps) => {
  // ** Props
  const { settings, children, scrollToTop, footerProps, contentHeightFixed, verticalLayoutProps } =
    props;

  // ** Vars
  const { skin, contentWidth } = settings;
  const { navigationSize, collapsedNavigationSize } = themeConfig;
  const navWidth = navigationSize;
  const navigationBorderWidth = skin === 'bordered' ? 1 : 0;
  const collapsedNavWidth = collapsedNavigationSize;

  // ** States
  const [navVisible, setNavVisible] = useState<boolean>(false);

  // ** Toggle Functions
  const toggleNavVisibility = () => setNavVisible(!navVisible);

  // ** Auth
  const { data } = useSession();

  const showNavigation = data?.user.profileIsComplete || data?.user.isWhitelisted;

  return (
    <>
      <VerticalLayoutWrapper className='layout-wrapper'>
        {/* Navigation Menu */}
        {showNavigation ? (
          <Navigation
            navWidth={navWidth}
            navVisible={navVisible}
            setNavVisible={setNavVisible}
            collapsedNavWidth={collapsedNavWidth}
            toggleNavVisibility={toggleNavVisibility}
            navigationBorderWidth={navigationBorderWidth}
            navMenuContent={verticalLayoutProps.navMenu.content}
            navMenuBranding={verticalLayoutProps.navMenu.branding}
            menuLockedIcon={verticalLayoutProps.navMenu.lockedIcon}
            verticalNavItems={verticalLayoutProps.navMenu.navItems}
            navMenuProps={verticalLayoutProps.navMenu.componentProps}
            menuUnlockedIcon={verticalLayoutProps.navMenu.unlockedIcon}
            afterNavMenuContent={verticalLayoutProps.navMenu.afterContent}
            beforeNavMenuContent={verticalLayoutProps.navMenu.beforeContent}
            {...props}
          />
        ) : null}
        <MainContentWrapper
          className='layout-content-wrapper'
          sx={{ ...(contentHeightFixed && { maxHeight: '100vh' }) }}
        >
          {/* AppBar Component */}
          <AppBar
            toggleNavVisibility={toggleNavVisibility}
            appBarContent={verticalLayoutProps.appBar?.content}
            appBarProps={verticalLayoutProps.appBar?.componentProps}
            {...props}
          />

          {/* Content */}
          <ContentWrapper
            className='layout-page-content'
            sx={{
              ...(contentHeightFixed && {
                overflow: 'hidden',
                '& > :first-of-type': { height: '100%' }
              }),
              ...(contentWidth === 'boxed' && {
                mx: 'auto',
                '@media (min-width:1440px)': { maxWidth: 1440 },
                '@media (min-width:1200px)': { maxWidth: '100%' }
              })
            }}
          >
            {children}
          </ContentWrapper>

          {/* Footer Component */}
          <Footer footerStyles={footerProps?.sx} footerContent={footerProps?.content} {...props} />
        </MainContentWrapper>
      </VerticalLayoutWrapper>

      {/* Scroll to top button */}
      {scrollToTop ? (
        scrollToTop(props)
      ) : (
        <ScrollToTop className='mui-fixed'>
          <Fab color='primary' size='small' aria-label='scroll back to top'>
            <Icon icon='mdi:arrow-up' />
          </Fab>
        </ScrollToTop>
      )}
    </>
  );
};

export default VerticalLayout;
