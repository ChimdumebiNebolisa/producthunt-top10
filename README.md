# Product Hunt Top 10 Viewer

A Next.js application that displays the top 10 most upvoted Product Hunt posts from the past 10 days.

## Features

- 🔐 Secure API authentication using OAuth2 client credentials flow
- 📊 Real-time data fetching from Product Hunt GraphQL API
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- ⚡ Fast loading with proper error handling

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: Product Hunt GraphQL API v2
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Product Hunt API credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ChimdumebiNebolisa/producthunt-top10.git
cd producthunt-top10
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Product Hunt API credentials to `.env.local`:
```
PRODUCTHUNT_API_KEY=your_api_key_here
PRODUCTHUNT_API_SECRET=your_api_secret_here
```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Using the Application

1. Click the **"Fetch Top 10"** button
2. Wait for the loading spinner to complete
3. View the top 10 most upvoted Product Hunt posts from the past 10 days
4. Click on any product name to visit its Product Hunt page

## Deployment

### Vercel Deployment

This project is configured for automatic deployment to Vercel via GitHub Actions.

#### Setting up Vercel Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add the following variables:
   - `PRODUCTHUNT_API_KEY`: Your Product Hunt API key
   - `PRODUCTHUNT_API_SECRET`: Your Product Hunt API secret

#### GitHub Secrets Setup

For automatic deployment, add these secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

### Manual Deployment

You can also deploy manually using the Vercel CLI:

```bash
npm install -g vercel
vercel --prod
```

## API Endpoints

- `GET /api/top10` - Fetches the top 10 Product Hunt posts from the past 10 days

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PRODUCTHUNT_API_KEY` | Product Hunt API client ID | Yes |
| `PRODUCTHUNT_API_SECRET` | Product Hunt API client secret | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).