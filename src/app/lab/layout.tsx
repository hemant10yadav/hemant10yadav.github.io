import type { Metadata } from 'next';
import { FULL_NAME, SITE_URL } from '../constants';

const PAGE_TITLE = `Lab - ${FULL_NAME}`;
const PAGE_DESCRIPTION =
  'Experiments and side projects: a live tech briefing (Pulse) and an interactive terminal with a virtual filesystem, built by Hemant Singh Yadav.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/lab`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  alternates: {
    canonical: `${SITE_URL}/lab`,
  },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
