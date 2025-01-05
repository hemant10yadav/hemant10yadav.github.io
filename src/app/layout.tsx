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
  title: 'HemantSingh Yadav - Software Engineer',
  description: 'Software Engineer with 3 years of experience specializing in Python, Java, and full-stack development. View my projects and experience in scalable system architecture.',
  keywords: ['Software Engineer', 'Full Stack Developer', 'Python', 'Java', 'JavaScript', 'React', 'Node.js', 'AWS', 'Angular'],
  openGraph: {
    title: 'HemantSingh Yadav - Software Engineer',
    description: 'Software Engineer with 3 years of experience building scalable systems.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Hemant Singh Yadav',
  },
  verification: {
    google: '8vq8glKpddiTZooSfmfXXQL5jEqiVFbBe0yDB7zj6NA', 
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://hemantsinghyadav.github.io'
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
