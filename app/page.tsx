import { Frame } from "./components/Frame";
import { CabinScene } from "./components/CabinScene";

export default function Home() {
  return (
    <main className="min-h-screen flex items-start sm:items-center justify-center relative py-4 sm:py-2">
      <Frame>
        <CabinScene />
      </Frame>
    </main>
  );
}
