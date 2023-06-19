import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { SWRConfig } from 'swr';
import { lightTheme } from 'themes';
import { AuthProvider, CartProvider, UIProvider } from 'context';
import 'styles/globals.css';
import { SnackbarProvider } from 'notistack';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <SWRConfig
        value={{
          fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
        }}>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={1500}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          variant="success">
          <AuthProvider>
            <CartProvider>
              <UIProvider>
                <ThemeProvider theme={lightTheme}>
                  <CssBaseline />
                  <Component {...pageProps} />
                </ThemeProvider>
              </UIProvider>
            </CartProvider>
          </AuthProvider>
        </SnackbarProvider>
      </SWRConfig>
    </SessionProvider>
  );
}
