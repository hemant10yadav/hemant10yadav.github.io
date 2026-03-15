import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { FULL_NAME, TITLE, SITE_URL } from './constants';
import { ViewerProvider } from './context/ViewerContext';
import { NavBar } from './components/Navbar';
import GitHubActivity from './components/GitHubActivity';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

const PAGE_TITLE = `${FULL_NAME} - ${TITLE}`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description:
    'Software Engineer with 4 years of experience specializing in Python, Java, and full-stack development. View my projects and experience in scalable system architecture.',
  keywords: [
    'Software Engineer',
    'Full Stack Developer',
    'Python',
    'Java',
    'JavaScript',
    'React',
    'Node.js',
    'AWS',
    'Angular',
  ],
  openGraph: {
    title: PAGE_TITLE,
    description: 'Software Engineer with 4 years of experience building scalable systems.',
    type: 'website',
    locale: 'en_US',
    siteName: FULL_NAME,
  },
  verification: {
    google: '2NWImAWGUUGBF1n43abjdyS6cskF6yjKXIBjYnkU17k',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${SITE_URL}/`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <ViewerProvider>
          <NavBar />
          {children}
          <GitHubActivity />
        </ViewerProvider>
      </body>
    </html>
  );
}
