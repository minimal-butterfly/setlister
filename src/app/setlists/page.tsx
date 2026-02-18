export default function Setlists() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <header className="w-full text-center sm:text-left mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50">Setlists</h1>
        </header>
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Your setlists will be displayed here.
          </p>
        </div>
      </main>
    </div>
  );
}
