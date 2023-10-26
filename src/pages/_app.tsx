// ** Next Imports
import Head from 'next/head';
import { Router } from 'next/router';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

// ** NextAuth
import { SessionProvider } from 'next-auth/react';

// ** Loader Import
import NProgress from 'nprogress';

// ** Config Imports
import themeConfig from 'src/configs/themeConfig';

// ** Third Party Import
import { Toaster } from 'react-hot-toast';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout';
import ThemeComponent from 'src/@core/theme/ThemeComponent';

import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext';

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast';

// ** Date Picker
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// ** Prismjs Styles
import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css';

import 'src/iconify-bundle/icons-bundle-react';

// ** Global css styles
import '../../styles/globals.css';
import { api } from 'src/utils/api';
import CreateProfileGuard from 'src/@core/components/auth/CreateProfileGuard';

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

// ** Configure JSS & ClassName
const App: any = (props: ExtendedAppProps) => {
  const {
    Component,
    pageProps: { session, ...pageProps }
  } = props;

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false;
  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>);
  const setConfig = Component.setConfig ?? undefined;

  return (
    <>
      <Head>
        <title>{`${themeConfig.templateName}`}</title>
        <meta name='description' content={`${themeConfig.templateName} meta content`} />
        <meta name='keywords' content='RapKing, Share Raps, Write Raps, Get Ranked' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <SessionProvider session={session}>
        <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
          <SettingsConsumer>
            {({ settings }) => {
              return (
                <ThemeComponent settings={settings}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <CreateProfileGuard>
                      {getLayout(<Component {...pageProps} />)}
                      <ReactQueryDevtools initialIsOpen={false} />
                    </CreateProfileGuard>
                  </LocalizationProvider>
                  <ReactHotToast>
                    <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
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
