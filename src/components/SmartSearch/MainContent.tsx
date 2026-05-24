import SearchInterface from "../SearchInterface";

const MainContent = () => {
  return (
    <main className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-hero px-3 py-6 sm:px-5 sm:py-8 lg:px-8">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-24 -top-32 h-[260px] w-[260px] rounded-full bg-primary/20 blur-3xl sm:h-[360px] sm:w-[360px]" />
        <div className="absolute -right-24 top-1/3 h-[280px] w-[280px] rounded-full bg-sky-400/20 blur-3xl sm:h-[420px] sm:w-[420px]" />
        <div className="absolute bottom-0 left-1/3 h-[220px] w-[220px] rounded-full bg-violet-400/20 blur-3xl sm:h-[280px] sm:w-[280px]" />
      </div>

      <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col">
        <SearchInterface />
      </div>
    </main>
  );
};

export default MainContent;