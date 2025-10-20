import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Product Hunt Top 10 Viewer",
  description: "Discover the top 10 most upvoted Product Hunt posts from the past 10 days. Sort by votes, launch date, or product name.",
  keywords: ["Product Hunt", "Top Products", "Startup", "Innovation", "Tech Products"],
  authors: [{ name: "Product Hunt Top 10 Viewer" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Product Hunt Top 10 Viewer",
    description: "Discover the top 10 most upvoted Product Hunt posts from the past 10 days",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
