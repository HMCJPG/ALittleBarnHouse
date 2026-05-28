import { HomeClient } from "./components/HomeClient";
import { IdentityProvider } from "./components/IdentityProvider";
import { SpotifyProvider } from "./components/SpotifyProvider";

export default function Home() {
  return (
    <IdentityProvider>
      <SpotifyProvider>
        <HomeClient />
      </SpotifyProvider>
    </IdentityProvider>
  );
}
