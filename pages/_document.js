import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Quantico:wght@700&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "75b28db06fcd4f898c2cfc5ba549ea78"}'></script>
      </body>
    </Html>
  );
}

