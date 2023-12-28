// ** Next Imports
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Router } from 'next/router';

// ** NextAuth
import { SessionProvider } from 'next-auth/react';

// ** Loader Import
import NProgress from 'nprogress';

// ** Config Imports
import themeConfig from 'src/configs/themeConfig';

// ** Third Party Import
import { Toaster } from 'react-hot-toast';

// ** Component Imports
import ThemeComponent from 'src/@core/theme/ThemeComponent';
import UserLayout from 'src/layouts/UserLayout';

import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext';

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast';

// ** Date Picker
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// ** Prismjs Styles
import 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/themes/prism-tomorrow.css';

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css';

import 'src/iconify-bundle/icons-bundle-react';

// ** Global css styles
import CreateProfileGuard from 'src/@core/components/auth/CreateProfileGuard';
import { api } from 'src/utils/api';
import '../../styles/globals.css';

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage;
};

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start();
  });
  Router.events.on('routeChangeError', () => {
    NProgress.done();
  });
  Router.events.on('routeChangeComplete', () => {
    NProgress.done();
  });
}

const NextJsHead = () => {
  return (
    <Head>
      <title>{`${themeConfig.templateName} | World's #1 Spot to Write, Judge, and Discuss Raps`}</title>
      <meta name='description' content={`${themeConfig.templateName} meta content`} />
      <meta
        name='description'
        content={`RapKing - the ultimate platform for rap enthusiasts! Dive into a world where you can write, share, and explore creative rap content. Engage with a vibrant community, comment on and judge rap battles, connect with fellow artists, and discover a hub of rap culture. Whether you're an aspiring rapper or a seasoned lyricist, RapKing is your go-to destination for all things rap. Join now to express yourself, collaborate, and elevate your rap skills!`}
      />
      <meta name='viewport' content='initial-scale=1, width=device-width' />

      {/* OG Tags */}
      <meta property='og:title' content={`World's #1 Spot to Write, Judge, and Discuss Raps`} />
      <meta
        property='og:description'
        content='Join RapKing to engage with a community of rap enthusiasts. Write, share, judge, and discuss raps. Connect with artists worldwide.'
      />
      <meta property='og:image' content='/images/crown.svg' />
      <meta property='og:url' content='https://www.rapking.io' />
      <meta property='og:type' content='website' />

      {/* Twitter Tags */}
      <meta name='twitter:title' content={`World's #1 Spot to Write, Judge, and Discuss Raps`} />
      <meta
        name='twitter:description'
        content='Join RapKing to engage with a community of rap enthusiasts. Write, share, judge, and discuss raps. Connect with artists worldwide.'
      />
      <meta name='twitter:image' content='/images/crown.svg' />
      <meta name='twitter:card' content='summary_large_image' />

      {/* Canonical Tag */}
      <link rel='canonical' href='https://www.rapking.io' />
    </Head>
  );
};

// ** Configure JSS & ClassName
const App: any = (props: ExtendedAppProps) => {
  const {
    Component,
    pageProps: { session, ...pageProps }
  } = props;

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false;
  const getLayout =
    Component.getLayout ??
    (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>);
  const setConfig = Component.setConfig ?? undefined;

  return (
    <>
      <NextJsHead />
      <SessionProvider session={session}>
        <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
          <SettingsConsumer>
            {({ settings }) => {
              return (
                <ThemeComponent settings={settings}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <CreateProfileGuard>
                      {getLayout(<Component {...pageProps} />)}
                      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
                    </CreateProfileGuard>
                  </LocalizationProvider>
                  <ReactHotToast>
                    <Toaster
                      position={settings.toastPosition}
                      toastOptions={{ className: 'react-hot-toast' }}
                    />
                  </ReactHotToast>
                </ThemeComponent>
              );
            }}
          </SettingsConsumer>
        </SettingsProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(App);
