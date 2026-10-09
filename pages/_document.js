import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import Document, { Head, Html, Main, NextScript } from 'next/document';

export default function MyDocument() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// Ant Design generates its CSS while rendering. Collect what the page used
// on the server and put it into the HTML, so the first paint is styled.
MyDocument.getInitialProps = async (ctx) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) =>
        function AppWithStyles(props) {
          return (
            <StyleProvider cache={cache}>
              <App {...props} />
            </StyleProvider>
          );
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  const css = extractStyle(cache, true);
  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style data-antd="ssr" dangerouslySetInnerHTML={{ __html: css }} />
      </>
    ),
  };
};
