# 🚀 Product Hunt Top 10 Viewer

A modern, interactive web application that displays the top 10 most upvoted Product Hunt posts from the past 10 days. Built with Next.js 15, TypeScript, and Tailwind CSS, featuring real-time data fetching, advanced sorting capabilities, and a beautiful responsive design.

![Product Hunt Top 10 Viewer](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Product Hunt API](https://img.shields.io/badge/Product_Hunt-FF6B35?style=for-the-badge&logo=product-hunt&logoColor=white)

## ✨ Features

### 🔥 Core Functionality
- **Real-time Data Fetching**: Get the latest top 10 Product Hunt posts from the past 10 days
- **Secure Authentication**: OAuth2 client credentials flow with Product Hunt API
- **Interactive Sorting**: Sort by votes, launch date, or product name (ascending/descending)
- **Responsive Design**: Beautiful, mobile-first UI that works on all devices
- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Smooth loading animations and feedback

### 🎨 User Experience
- **Clickable Product Links**: Direct links to Product Hunt product pages
- **Visual Sort Indicators**: Clear icons showing current sort direction
- **Hover Effects**: Interactive table rows with smooth transitions
- **Modern UI**: Clean, professional design with Tailwind CSS
- **Accessibility**: Proper ARIA labels and keyboard navigation support

### 🚀 Technical Features
- **Next.js 15**: Latest App Router with server-side rendering
- **TypeScript**: Full type safety and better developer experience
- **API Routes**: Secure server-side API endpoints
- **Environment Variables**: Secure credential management
- **GitHub Actions**: Automated deployment to Vercel
- **SEO Optimized**: Meta tags, Open Graph, and structured data

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.6 | React framework with App Router |
| **TypeScript** | Latest | Type-safe JavaScript |
| **Tailwind CSS** | Latest | Utility-first CSS framework |
| **Product Hunt API** | v2 | GraphQL API for product data |
| **Vercel** | Latest | Deployment platform |
| **GitHub Actions** | Latest | CI/CD pipeline |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control
- **Product Hunt API credentials** (client ID and secret)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ChimdumebiNebolisa/producthunt-top10.git
cd producthunt-top10
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add your Product Hunt API credentials:

```env
PRODUCTHUNT_API_KEY=your_api_key_here
PRODUCTHUNT_API_SECRET=your_api_secret_here
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 How to Use

### 🎯 Basic Usage

1. **Launch the Application**: Open the app in your browser
2. **Fetch Data**: Click the "Fetch Top 10" button
3. **View Results**: See the top 10 Product Hunt posts in a beautiful table
4. **Sort Data**: Click on column headers to sort by:
   - **Product Name** (A-Z or Z-A)
   - **Votes** (Highest to Lowest or vice versa)
   - **Launch Date** (Newest to Oldest or vice versa)
5. **Visit Products**: Click any product name to visit its Product Hunt page

### 🔄 Sorting Features

The application includes advanced sorting capabilities:

- **Visual Indicators**: Sort icons show current direction (↑ ascending, ↓ descending)
- **Multi-column Sorting**: Sort by any column with visual feedback
- **Persistent State**: Sort preferences maintained during session
- **Smooth Transitions**: Animated sorting with hover effects

### 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full table view with all features
- **Tablet**: Optimized layout with horizontal scrolling
- **Mobile**: Touch-friendly interface with stacked layout

## 🔧 API Documentation

### Endpoints

#### `GET /api/top10`

Fetches the top 10 most upvoted Product Hunt posts from the past 10 days.

**Response Format:**
```json
[
  {
    "name": "Product Name",
    "tagline": "Product description",
    "votesCount": 1234,
    "createdAt": "2024-01-01T00:00:00Z",
    "url": "https://www.producthunt.com/posts/product-name"
  }
]
```

**Error Handling:**
- `500`: Missing API credentials
- `500`: Failed to obtain access token
- `500`: Failed to fetch data from Product Hunt API
- `500`: Invalid response format

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**:
   - Go to **Settings** → **Environment Variables**
   - Add the following variables:
     ```
     PRODUCTHUNT_API_KEY=your_api_key_here
     PRODUCTHUNT_API_SECRET=your_api_secret_here
     ```

3. **Deploy**:
   - Vercel will automatically deploy on every push to main branch
   - Your app will be available at `https://your-project.vercel.app`

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

### GitHub Actions Setup

For automatic deployment, add these secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

## 🔐 Security

### Environment Variables

- **Never commit** `.env.local` to version control
- **Use** `.env.example` as a template for required variables
- **Rotate** API credentials regularly
- **Monitor** API usage and rate limits

### API Security

- **OAuth2 Flow**: Secure client credentials authentication
- **Server-side Only**: API credentials never exposed to client
- **Error Handling**: No sensitive information in error messages
- **Rate Limiting**: Respects Product Hunt API limits

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npm run type-check
```

### Project Structure

```
producthunt-top10/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── top10/
│   │   │       └── route.ts      # API endpoint
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Main page component
│   └── components/               # Reusable components
├── public/
│   └── favicon.svg               # Custom favicon
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions workflow
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

### Code Quality

- **ESLint**: Code linting and style enforcement
- **TypeScript**: Static type checking
- **Prettier**: Code formatting (if configured)
- **Husky**: Git hooks for quality checks

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass
- Follow conventional commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Product Hunt** for providing the amazing API
- **Next.js Team** for the incredible framework
- **Vercel** for seamless deployment
- **Tailwind CSS** for the beautiful styling system

## 📞 Support

If you encounter any issues or have questions:

1. **Check** the [Issues](https://github.com/ChimdumebiNebolisa/producthunt-top10/issues) page
2. **Create** a new issue with detailed information
3. **Contact** the maintainers

## 🔮 Future Enhancements

- [ ] **Caching**: Implement Redis caching for better performance
- [ ] **Filters**: Add date range and category filters
- [ ] **Export**: Export data to CSV/PDF
- [ ] **Notifications**: Real-time updates for new top products
- [ ] **Analytics**: Track user interactions and popular products
- [ ] **Dark Mode**: Toggle between light and dark themes
- [ ] **PWA**: Progressive Web App capabilities
- [ ] **Internationalization**: Multi-language support

---

**Made with ❤️ by the Product Hunt Top 10 Viewer Team**

[![GitHub stars](https://img.shields.io/github/stars/ChimdumebiNebolisa/producthunt-top10?style=social)](https://github.com/ChimdumebiNebolisa/producthunt-top10)
[![GitHub forks](https://img.shields.io/github/forks/ChimdumebiNebolisa/producthunt-top10?style=social)](https://github.com/ChimdumebiNebolisa/producthunt-top10)
[![GitHub issues](https://img.shields.io/github/issues/ChimdumebiNebolisa/producthunt-top10)](https://github.com/ChimdumebiNebolisa/producthunt-top10/issues)