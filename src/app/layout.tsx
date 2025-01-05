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
  title: 'Hemant Singh Yadav - Software Engineer',
  description: 'Software Engineer with 3 years of experience specializing in Python, Java, and full-stack development. View my projects and experience in scalable system architecture.',
  keywords: ['Software Engineer', 'Full Stack Developer', 'Python', 'Java', 'JavaScript', 'React', 'Node.js', 'AWS', 'Angular'],
  metadataBase: new URL('https://hemant10yadav.github.io'),
  openGraph: {
    title: 'Hemant Singh Yadav - Software Engineer',
    description: 'Software Engineer with 3 years of experience building scalable systems.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Hemant Singh Yadav - Software Engineer',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hemant Singh Yadav - Software Engineer',
    description: 'Software Engineer with 3 years of experience specializing in Python, Java, and full-stack development. View my projects and experience in scalable system architecture.',
    images: ['/twitter-image.png'],
  },
  verification: {
    google: '2NWImAWGUUGBF1n43abjdyS6cskF6yjKXIBjYnkU17k', 
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://hemant10yadav.github.io/'
  }
}

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
