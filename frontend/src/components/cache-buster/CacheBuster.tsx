import { useEffect, useState } from "react";
import packageJson from "@base/../package.json";
global.appVersion = packageJson.version;

// version from response - first param, local version second param
const semverGreaterThan = (versionA: string, versionB: string) => {
  const versionsA = versionA.split(/\./g);

  const versionsB = versionB.split(/\./g);
  while (versionsA.length || versionsB.length) {
    const a = Number(versionsA.shift());

    const b = Number(versionsB.shift());
    // eslint-disable-next-line no-continue
    if (a === b) continue;
    // eslint-disable-next-line no-restricted-globals
    return a > b || isNaN(b);
  }
  return false;
};

const refreshCacheAndReload = () => {
  console.log("Clearing cache and hard reloading...");
  if (caches) {
    // Service worker cache should be cleared with caches.delete()
    caches.keys().then(function (names) {
      for (const name of names) caches.delete(name);
    });
  }

  // delete browser cache and hard reload
  window.location.reload();
};

interface CacheBusterProps {
  children: (
    isLoading: boolean,
    isLatestVersion: boolean,
    refreshCacheAndReload: () => void,
  ) => JSX.Element | null;
}

const CacheBuster = ({ children }: CacheBusterProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLatestVersion, setIsLatestVersion] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      fetch("./meta.json")
        .then((response) => {
          if (!response.ok) {
            // If response is not ok, throw an error
            throw new Error(
              `Network response was not ok: ${response.statusText}`,
            );
          }
          return response.json(); // Parse the JSON response
        })
        .then((meta) => {
          const latestVersion = meta.version;
          const currentVersion = global.appVersion;
          const shouldForceRefresh = semverGreaterThan(
            latestVersion,
            currentVersion,
          );
          if (shouldForceRefresh) {
            console.log(
              `We have a new version - ${latestVersion}. Should force refresh`,
            );
            setIsLoading(false);
            setIsLatestVersion(false);
          } else {
            console.log(
              `You already have the latest version - ${latestVersion}. No cache refresh needed.`,
            );
            setIsLoading(false);
            setIsLatestVersion(true);
          }
        })
        .catch((error) => {
          // Log any errors to the console
          console.error("Fetch error:", error);
          setIsLoading(false);
          setIsLatestVersion(true); // Optionally set this to true or false based on your needs
        });
    } else {
      setIsLoading(false);
      setIsLatestVersion(true);
    }
  }, []);

  return children(isLoading, isLatestVersion, refreshCacheAndReload);
};

export default CacheBuster;
