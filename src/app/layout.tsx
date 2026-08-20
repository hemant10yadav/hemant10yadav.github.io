import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';
import { FULL_NAME, TITLE, SITE_URL } from './constants';
import { ViewerProvider } from './context/ViewerContext';
import { NavBar } from './components/Navbar';
import GitHubActivity from './components/GitHubActivity';
import WeatherAmbient from './components/WeatherAmbient';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

const PAGE_TITLE = `${FULL_NAME} - ${TITLE}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    url: SITE_URL,
    type: 'website',
    locale: 'en_US',
    siteName: FULL_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: 'Software Engineer with 4 years of experience building scalable systems.',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme — runs before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var m=localStorage.getItem('hy_color_mode')||'dark';document.documentElement.setAttribute('data-theme',m);}catch(e){}})();` }} />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${outfit.variable} antialiased`}>
        <ViewerProvider>
          <WeatherAmbient devMode={process.env.DEV === 'true'} />
          <NavBar />
          {children}
          <GitHubActivity />
        </ViewerProvider>
      </body>
    </html>
  );
}
