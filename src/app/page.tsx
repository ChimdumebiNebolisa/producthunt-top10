'use client';

import { useState } from 'react';

interface Post {
  name: string;
  tagline: string;
  votesCount: number;
  createdAt: string;
  url: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTop10 = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/top10');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Product Hunt Top 10 Viewer
        </h1>
        
        <div className="flex justify-center mb-8">
          <button
            onClick={fetchTop10}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            ) : (
              'Fetch Top 10'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {posts.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Rank</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Product Name</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Tagline</th>
                    <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700">Votes</th>
                    <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700">Launch Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {posts.map((post, index) => (
                    <tr key={post.name} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-center text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="py-4 px-6">
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          {post.name}
                        </a>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">
                        {post.tagline}
                      </td>
                      <td className="py-4 px-6 text-center text-sm font-medium text-gray-900">
                        {post.votesCount.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-center text-sm text-gray-700">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {posts.length === 0 && !loading && !error && (
          <div className="text-center text-gray-500 mt-8">
            Click &quot;Fetch Top 10&quot; to see the most upvoted Product Hunt posts from the past 10 days.
          </div>
        )}
      </div>
    </div>
  );
}
