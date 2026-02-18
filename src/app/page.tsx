import Image from "next/image";
import { getArtistReleases } from '../services/discogsService';
import Navigation from '../components/Navigation';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <header className="w-full text-center sm:text-left mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50">SETLISTER</h1>
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">Discogs Artist Releases</h2>
          <Navigation />
        </header>
      </main>
    </div>
  );
}
