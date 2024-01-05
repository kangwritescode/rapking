// ** React Import
import { Children } from 'react';

// ** Next Import
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { env } from 'src/env.mjs';

class CustomDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
          />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
          />
          <link rel='apple-touch-icon' sizes='180x180' href='/images/crown.svg' />
          <link rel='shortcut icon' href='/images/crown.svg' />
          <link rel='favicon' href='/images/crown.svg' />
          <meta
            httpEquiv='Content-Security-Policy'
            content={`
              default-src 'self';
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' data: https://storage.googleapis.com;
              object-src 'none';
              base-uri 'self';
              font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;
              connect-src 'self' https://api.iconify.design;
              frame-src 'self' https://www.youtube.com https://www.soundcloud.com https://w.soundcloud.com https://giphy.com/;
              ${
                env.NODE_ENV === 'development'
                  ? `script-src 'self' 'unsafe-eval';`
                  : `script-src 'self';`
              }
            `}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

CustomDocument.getInitialProps = async ctx => {
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props =>
        (
          <App
            {...props} // @ts-ignore
          />
        )
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [...Children.toArray(initialProps.styles)]
  };
};

export default CustomDocument;
