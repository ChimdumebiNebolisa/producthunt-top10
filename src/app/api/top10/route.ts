import { NextResponse } from 'next/server';

interface ProductHuntPost {
  name: string;
  tagline: string;
  votesCount: number;
  createdAt: string;
  url: string;
}

interface ProductHuntResponse {
  data: {
    posts: {
      edges: Array<{
        node: ProductHuntPost;
      }>;
    };
  };
}

export async function GET() {
  try {
    const { PRODUCTHUNT_API_KEY, PRODUCTHUNT_API_SECRET } = process.env;

    if (!PRODUCTHUNT_API_KEY || !PRODUCTHUNT_API_SECRET) {
      return NextResponse.json(
        { error: 'Missing Product Hunt API credentials' },
        { status: 500 }
      );
    }

    // Get access token using OAuth2 client credentials flow
    const tokenResponse = await fetch('https://api.producthunt.com/v2/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: PRODUCTHUNT_API_KEY,
        client_secret: PRODUCTHUNT_API_SECRET,
        grant_type: 'client_credentials',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token request failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to obtain access token from Product Hunt' },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token received from Product Hunt' },
        { status: 500 }
      );
    }

    // Calculate date range (past 10 days)
    const today = new Date();
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(today.getDate() - 9);

    const postedAfter = tenDaysAgo.toISOString();
    const postedBefore = today.toISOString();

    // GraphQL query
    const query = `
      query GetTopPosts($postedAfter: DateTime!, $postedBefore: DateTime!) {
        posts(
          postedAfter: $postedAfter,
          postedBefore: $postedBefore,
          order: VOTES,
          first: 10
        ) {
          edges {
            node {
              name
              tagline
              votesCount
              createdAt
              url
            }
          }
        }
      }
    `;

    // Fetch data from Product Hunt GraphQL API
    const response = await fetch('https://api.producthunt.com/v2/api/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          postedAfter,
          postedBefore,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GraphQL request failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch data from Product Hunt API' },
        { status: 500 }
      );
    }

    const data: ProductHuntResponse = await response.json();

    if (!data.data?.posts?.edges) {
      return NextResponse.json(
        { error: 'Invalid response format from Product Hunt API' },
        { status: 500 }
      );
    }

    // Extract posts and sort by votes count (descending)
    const posts = data.data.posts.edges
      .map(edge => edge.node)
      .sort((a, b) => b.votesCount - a.votesCount)
      .slice(0, 10);

    return NextResponse.json(posts);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
