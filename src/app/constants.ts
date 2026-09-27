// ─────────────────────────────────────────────────────────────────────────────
// constants.ts — single source of truth for all personal / contact data
// Update here and it propagates everywhere automatically.
// ─────────────────────────────────────────────────────────────────────────────

// ── identity ──────────────────────────────────────────────────────────────────
export const FULL_NAME         = 'Hemant Singh Yadav';
export const TITLE             = 'Software Engineer';
export const CAREER_START      = new Date('2021-12-01');

// Rounded to the nearest half year, e.g. "4.5 years". Used by the hero, meta description, and terminal.
export const getExperienceLabel = (): string => {
  const now = new Date();
  let years = now.getFullYear() - CAREER_START.getFullYear();
  let months = now.getMonth() - CAREER_START.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  return months >= 6 ? `${years}.5 years` : `${years} years`;
};
export const EXPERIENCE_LABEL  = getExperienceLabel();

// Reach of the systems I work on at Dimagi. One place so the hero and experience sections agree.
export const COUNTRIES_SERVED  = '130+';

// ── contact ───────────────────────────────────────────────────────────────────
export const EMAIL             = 'hemant.10.yadav@gmail.com';
export const GITHUB_USERNAME   = 'hemant10yadav';
export const LINKEDIN_HANDLE   = 'hemantyadv';
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
  period:   'Jun 2024 — Present',
  location: 'Delhi, India',
  current:  true,
} as const;

// Where I started; acquired by Xcaliber Infotech
export const SARAL = {
  name: 'Saral Technologies',
  url:  'https://saral.io/',
} as const;

export const XCALIBER = {
  name:     'Xcaliber Infotech Pvt. Ltd.',
  url:      'https://xcaliberinfotech.com/',
  period:   'Dec 2021 — Jun 2024',
  location: 'Pune, India',
  current:  false,
} as const;

// ── day-job product (open source) ─────────────────────────────────────────────
export const COMMCARE_CONNECT = {
  name:    'CommCare Connect',
  repoUrl: 'https://github.com/dimagi/commcare-connect',
} as const;

// Dimagi repos I contribute to, shown on the Dimagi experience card.
export const DIMAGI_REPOS = [
  { name: 'CommCare Connect', url: COMMCARE_CONNECT.repoUrl },
  { name: 'ConnectID',        url: 'https://github.com/dimagi/connect-id' },
  { name: 'CommCare HQ',      url: 'https://github.com/dimagi/commcare-hq' },
] as const;

// Merged PRs on commcare-connect. The live count is fetched on page load by
// useMergedPrCount; this is shown until it arrives or if GitHub is unreachable.
export const CONNECT_MERGED_PRS_FALLBACK = '197';
export const CONNECT_MERGED_PRS_URL = `${COMMCARE_CONNECT.repoUrl}/pulls?q=is%3Apr+is%3Amerged+author%3A${GITHUB_USERNAME}`;

// Merged PRs worth reading. Each one links to the real diff and review thread.
export const CONNECT_HIGHLIGHT_PRS = [
  {
    number:   1536,
    title:    'Fix slow query powering the Work Area Assignments tab',
    headline: 'Made a page that kept timing out 420x faster: 36.8s → 0.09s',
    url:      `${COMMCARE_CONNECT.repoUrl}/pull/1536`,
  },
  {
    number:   1515,
    title:    'Fix query fan-out in active_flags_for_user',
    headline: 'Cut the database work behind a common check from 501,300 rows to 6',
    url:      `${COMMCARE_CONNECT.repoUrl}/pull/1515`,
  },
] as const;

// ── projects ──────────────────────────────────────────────────────────────────
export const PROJECT_KICKTRACK = {
  title:      'KickTrack',
  githubUrl:  `${GITHUB_URL}/KickTrack`,
  writeupUrl: `${SITE_URL}/KickTrack/`,
  repoPublic: true,
  // demos/list.json lists each clip as { name, title }; name.mp4 plays with name.jpg as its poster
  demosBaseUrl: `${SITE_URL}/KickTrack/demos`,
} as const;

export const PROJECT_SYNCSIM = {
  title:       'syncsim',
  githubUrl:   `${GITHUB_URL}/syncsim`,
  demoUrl:     `${SITE_URL}/syncsim/`,
  approachUrl: `${GITHUB_URL}/syncsim/blob/main/docs/APPROACH.md`,
  // Same demos/list.json format as KickTrack
  demosBaseUrl: `${SITE_URL}/syncsim/demos`,
} as const;

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
