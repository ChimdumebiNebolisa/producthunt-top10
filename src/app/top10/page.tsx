'use client';

import Link from 'next/link';
import { useState } from 'react';
import { exportToPDF } from '@/utils/pdfExport';

async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to fallback
    }
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

interface Post {
  name: string;
  tagline: string;
  votesCount: number;
  createdAt: string;
  url: string;
}

type SortField = 'votesCount' | 'createdAt' | 'name';
type SortDirection = 'asc' | 'desc';

function StatsStrip({ posts }: { posts: Post[] }) {
  const totalVotes = posts.reduce((s, p) => s + p.votesCount, 0);
  const averageVotes = posts.length ? Math.round(totalVotes / posts.length) : 0;
  const highest = posts.length
    ? posts.reduce((max, p) => (p.votesCount > max.votesCount ? p : max), posts[0])
    : null;
  const lowest = posts.length
    ? posts.reduce((min, p) => (p.votesCount < min.votesCount ? p : min), posts[0])
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="surface-panel rounded-xl p-4 shadow-sm">
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Total votes</p>
        <p className="text-lg font-semibold text-[hsl(var(--foreground))]">{totalVotes.toLocaleString()}</p>
      </div>
      <div className="surface-panel rounded-xl p-4 shadow-sm">
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Average votes</p>
        <p className="text-lg font-semibold text-[hsl(var(--foreground))]">{averageVotes.toLocaleString()}</p>
      </div>
      <div className="surface-panel rounded-xl p-4 shadow-sm">
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Highest votes</p>
        <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate" title={highest?.name}>
          {highest ? `${highest.name} - ${highest.votesCount.toLocaleString()} votes` : 'n/a'}
        </p>
      </div>
      <div className="surface-panel rounded-xl p-4 shadow-sm">
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Lowest votes</p>
        <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate" title={lowest?.name}>
          {lowest ? `${lowest.name} - ${lowest.votesCount.toLocaleString()} votes` : 'n/a'}
        </p>
      </div>
    </div>
  );
}

export default function Top10Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [copyConfirmed, setCopyConfirmed] = useState(false);
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
      setLastUpdated(new Date());
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

  const handleCopySummary = async () => {
    const dateLine = lastUpdated
      ? lastUpdated.toLocaleDateString('en-US', { dateStyle: 'medium' })
      : new Date().toLocaleDateString('en-US', { dateStyle: 'medium' });
    const top3ByVotes = [...posts]
      .sort((a, b) => b.votesCount - a.votesCount)
      .slice(0, 3);
    const totalVotes = posts.reduce((s, p) => s + p.votesCount, 0);
    const avgVotes = posts.length ? Math.round(totalVotes / posts.length) : 0;

    const lines = [
      `Product Hunt Top 10 - ${dateLine}`,
      '',
      'Top 3:',
      ...top3ByVotes.map((p, i) => `${i + 1}. ${p.name} - ${p.votesCount.toLocaleString()} votes`),
      '',
      `Total votes: ${totalVotes.toLocaleString()} | Average: ${avgVotes.toLocaleString()}`,
    ];
    const text = lines.join('\n');
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopyConfirmed(true);
      setTimeout(() => setCopyConfirmed(false), 1500);
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-[hsl(var(--muted-foreground))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-[hsl(var(--primary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-[hsl(var(--primary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    );
  };

  const hasData = posts.length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-6xl">
        <header className="surface-panel rounded-2xl px-4 py-4 sm:px-6 sm:py-5 w-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <Link href="/" className="text-xl font-bold text-[hsl(var(--foreground))] hover:underline">
              Product Hunt Top 10
            </Link>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              Top products from the last 10 days
            </p>
            {lastUpdated !== null && (
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                Last updated: {lastUpdated.toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                hasData
                  ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] border-[hsl(var(--primary)/0.3)]'
                  : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))]'
              }`}
            >
              {hasData ? 'Live data loaded' : 'No data loaded'}
            </span>
            <button
              onClick={fetchTop10}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl font-medium text-[hsl(var(--primary-foreground))] bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-2))] disabled:opacity-70 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--ring)/0.35)]"
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
              <>
                <button
                  onClick={handleCopySummary}
                  className="px-5 py-2.5 rounded-xl bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/0.75)] transition-colors font-medium flex items-center gap-2 disabled:opacity-70"
                  disabled={copyConfirmed}
                >
                  {copyConfirmed ? (
                    'Copied'
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2m0 4V6a2 2 0 00-2-2h-2m-4 0h-2a2 2 0 00-2 2v8a2 2 0 002 2h2" />
                      </svg>
                      Copy summary
                    </>
                  )}
                </button>
                <button
                  onClick={() => exportToPDF(sortedPosts, sortField, sortDirection)}
                  className="px-5 py-2.5 rounded-xl bg-[hsl(var(--foreground))] text-white hover:bg-[hsl(var(--foreground)/0.9)] transition-colors font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export PDF
                </button>
              </>
            )}
          </div>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {posts.length > 0 && (
          <>
            <StatsStrip posts={posts} />
            <div className="surface-panel shadow-lg rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[hsl(var(--muted))]">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-[hsl(var(--foreground))]">Rank</th>
                    <th 
                      className="py-4 px-6 text-left text-sm font-semibold text-[hsl(var(--foreground))] cursor-pointer hover:bg-[hsl(var(--border)/0.45)] transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Product Name
                        {getSortIcon('name')}
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-[hsl(var(--muted-foreground))]">Tagline</th>
                    <th 
                      className="py-4 px-6 text-center text-base font-bold text-[hsl(var(--foreground))] cursor-pointer hover:bg-[hsl(var(--border)/0.45)] transition-colors"
                      onClick={() => handleSort('votesCount')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Votes
                        {getSortIcon('votesCount')}
                      </div>
                    </th>
                    <th 
                      className="py-4 px-6 text-center text-sm font-semibold text-[hsl(var(--foreground))] cursor-pointer hover:bg-[hsl(var(--border)/0.45)] transition-colors"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Launch Date
                        {getSortIcon('createdAt')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(var(--border))]">
                  {sortedPosts.map((post, index) => (
                    <tr key={post.name} className="hover:bg-[hsl(var(--muted)/0.72)] transition-colors">
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center min-w-[2rem] py-0.5 px-2 rounded-full bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] text-sm font-semibold">
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary-2))] hover:underline font-medium"
                        >
                          {post.name}
                        </a>
                      </td>
                      <td className="py-4 px-6 text-sm text-[hsl(var(--muted-foreground))]">
                        {post.tagline}
                      </td>
                      <td className="py-4 px-6 text-center text-lg font-bold text-[hsl(var(--foreground))]">
                        {post.votesCount.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-center text-sm text-[hsl(var(--foreground))]">
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
          </>
        )}

        {posts.length === 0 && !loading && !error && (
          <div className="surface-panel rounded-xl px-4 py-3 text-center text-[hsl(var(--muted-foreground))] mt-8">
            Use Fetch Top 10 to load the latest Product Hunt data.
          </div>
        )}
      </div>
    </div>
  );
}
