'use client';

import { useState } from 'react';
import { exportToPDF } from '../utils/pdfExport';

interface Post {
  name: string;
  tagline: string;
  votesCount: number;
  createdAt: string;
  url: string;
}

type SortField = 'votesCount' | 'createdAt' | 'name';
type SortDirection = 'asc' | 'desc';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('votesCount');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case 'votesCount':
        aValue = a.votesCount;
        bValue = b.votesCount;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Product Hunt Top 10 Viewer
        </h1>
        
        <div className="flex justify-center gap-4 mb-8">
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
          
          {posts.length > 0 && (
            <button
              onClick={() => exportToPDF(sortedPosts, sortField, sortDirection)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
          )}
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
                    <th 
                      className="py-4 px-6 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Product Name
                        {getSortIcon('name')}
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Tagline</th>
                    <th 
                      className="py-4 px-6 text-center text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => handleSort('votesCount')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Votes
                        {getSortIcon('votesCount')}
                      </div>
                    </th>
                    <th 
                      className="py-4 px-6 text-center text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Launch Date
                        {getSortIcon('createdAt')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedPosts.map((post, index) => (
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
