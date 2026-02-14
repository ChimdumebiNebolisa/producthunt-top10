import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl text-center">
        <div className="surface-panel rounded-3xl px-7 py-10 sm:px-12 sm:py-12 shadow-[0_20px_60px_-32px_hsl(var(--primary)/0.42)]">
          <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-4 sm:text-5xl">
            Product Hunt Top 10
          </h1>
          <p className="text-lg text-[hsl(var(--muted-foreground))] mb-8">
            Discover the most upvoted products from the past 10 days.
          </p>
          <Link
            href="/top10"
            className="inline-flex items-center justify-center px-7 py-3 rounded-xl font-semibold text-[hsl(var(--primary-foreground))] bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-2))] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--ring)/0.35)]"
          >
            View Top 10
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="surface-panel rounded-xl px-4 py-3 text-sm font-medium text-[hsl(var(--foreground))]">
            Trusted Product Hunt source
          </div>
          <div className="surface-panel rounded-xl px-4 py-3 text-sm font-medium text-[hsl(var(--foreground))]">
            Live API-backed ranking
          </div>
          <div className="surface-panel rounded-xl px-4 py-3 text-sm font-medium text-[hsl(var(--foreground))]">
            Quick export for sharing
          </div>
        </div>

        <p className="mt-8 text-sm text-[hsl(var(--muted-foreground))]">
          Built for clear insights with a colorful, lightweight interface.
        </p>
      </div>
    </div>
  );
}
