import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Hemant Singh Yadav - Software Engineer',
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
    title: 'Hemant Singh Yadav - Software Engineer',
    description: 'Software Engineer with 4 years of experience building scalable systems.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Hemant Singh Yadav',
  },
  verification: {
    google: '2NWImAWGUUGBF1n43abjdyS6cskF6yjKXIBjYnkU17k',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://hemant10yadav.github.io/',
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
        {children}
      </body>
    </html>
  );
}
