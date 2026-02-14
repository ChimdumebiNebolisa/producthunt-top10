import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Product Hunt Top 10
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover the most upvoted products from the past 10 days.
        </p>
        <Link
          href="/top10"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          View Top 10
        </Link>
      </div>
    </div>
  );
}
