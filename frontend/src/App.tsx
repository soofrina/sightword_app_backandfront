import { useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useRecoilState } from "recoil";
import themeAtom from "@recoil/theme/atom";
import BaseRouter from "@base/components/routers/base-router";
import CacheBuster from "@components/cache-buster/CacheBuster";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const [theme] = useRecoilState(themeAtom);
  const currentTheme = createTheme(theme);
  const queryClient = new QueryClient();

  useEffect(() => {
    if (currentTheme.palette.mode === "dark") {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    }
  }, [currentTheme.palette.mode]);

  return (
    <CacheBuster>
      {(isLoading, isLatestVersion, refreshCacheAndReload) => {
        if (isLoading) return null;
        if (!isLoading && !isLatestVersion) {
          refreshCacheAndReload();
        }

        return (
          <GoogleOAuthProvider
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}
          >
            <QueryClientProvider client={queryClient}>
              <ThemeProvider theme={currentTheme}>
                <div className={currentTheme.palette.mode}>
                  <CssBaseline />
                  <BaseRouter />
                </div>
              </ThemeProvider>
            </QueryClientProvider>
          </GoogleOAuthProvider>
        );
      }}
    </CacheBuster>
  );
}

export default App;
