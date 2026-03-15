// ─────────────────────────────────────────────────────────────────────────────
// constants.ts — single source of truth for all personal / contact data
// Update here and it propagates everywhere automatically.
// ─────────────────────────────────────────────────────────────────────────────

// ── identity ──────────────────────────────────────────────────────────────────
export const FULL_NAME         = 'Hemant Singh Yadav';
export const TITLE             = 'Software Engineer';
export const CAREER_START      = new Date('2021-12-01');

// ── contact ───────────────────────────────────────────────────────────────────
export const EMAIL             = 'hemant.10.yadav@gmail.com';
export const GITHUB_USERNAME   = 'hemant10yadav';
export const LINKEDIN_HANDLE   = 'hemantyad';
export const SO_USER_ID        = '20470646';

// ── derived URLs ──────────────────────────────────────────────────────────────
export const GITHUB_URL        = `https://github.com/${GITHUB_USERNAME}`;
export const LINKEDIN_URL      = `https://www.linkedin.com/in/${LINKEDIN_HANDLE}`;
export const SO_URL            = `https://stackoverflow.com/users/${SO_USER_ID}/${FULL_NAME.toLowerCase().replace(/ /g, '-')}`;
export const SITE_URL          = `https://${GITHUB_USERNAME}.github.io`;
export const MAILTO            = `mailto:${EMAIL}`;

// ── assets ────────────────────────────────────────────────────────────────────
export const PROFILE_PIC_URL   = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/Resources/main/hy-min.png`;

// ── resume (Google Docs) ──────────────────────────────────────────────────────
export const RESUME_PDF_URL    = 'https://docs.google.com/document/d/1slEvO5HrIn7_M5ehOEjefiW7ND6MDfgW0UtzZCKT0Qo/export?format=pdf';
export const RESUME_VIEW_URL   = 'https://docs.google.com/document/d/e/2PACX-1vRy5MkRddjiK9wAMN2uIEqFV7t58Ywa8XVK_gNIqpz-7YajDTfmhdqdYjMe2mG5ZHkPVQg1WzK2DbDq/pub';
export const RESUME_EMBED_URL  = `${RESUME_VIEW_URL}?embedded=true`;

// ── google apps script (contact form) ────────────────────────────────────────
export const CONTACT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw8CDP86j0c-n7llXDuZgexwSkP1FeMy_Ihpl5Qw2q4rAM36ORehcj4qu_7J_X3mr2-/exec';

// ── companies ─────────────────────────────────────────────────────────────────
export const DIMAGI = {
  name:     'Dimagi Inc.',
  url:      'https://dimagi.com/',
  period:   'Dec 2023 — Present',
  location: 'Delhi, India',
  current:  true,
} as const;

export const XCALIBER = {
  name:     'Xcaliber Infotech Pvt. Ltd.',
  url:      'https://xcaliberinfotech.com/',
  period:   'Dec 2021 — Dec 2023',
  location: 'Pune, India',
  current:  false,
} as const;

// ── projects ──────────────────────────────────────────────────────────────────
export const PROJECT_ECOMMERCE = {
  title:     'E-Commerce Platform',
  githubUrl: `${GITHUB_URL}/E-Commerce-website`,
} as const;

export const PROJECT_ESTORE = {
  title:     'E-Store',
  githubUrl: `${GITHUB_URL}/Sell2U-Node`,
} as const;

export const PROJECT_BOOKSTORE = {
  title:     'Book Store',
  githubUrl: `${GITHUB_URL}/book-store`,
  demoUrl:   `${SITE_URL}/book-store/`,
} as const;
