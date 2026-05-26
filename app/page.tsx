import { HomeClient } from "./components/HomeClient";
import { IdentityProvider } from "./components/IdentityProvider";

export default function Home() {
  return (
    <IdentityProvider>
      <HomeClient />
    </IdentityProvider>
  );
}
