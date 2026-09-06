import {
  FULL_NAME, TITLE, SITE_URL, EMAIL, GITHUB_URL, LINKEDIN_URL, SO_URL,
  DIMAGI, XCALIBER, PROJECT_ECOMMERCE, PROJECT_ESTORE, PROJECT_BOOKSTORE,
} from '../constants';

export const dynamic = 'force-static';

export async function GET() {
  const body = `# ${FULL_NAME}

> ${TITLE} based in India. This file is a plain-text summary for AI assistants and language models — for the full interactive experience, visit ${SITE_URL}/.

## About

${FULL_NAME} is a ${TITLE} with experience in Python, Java, and full-stack development, focused on scalable system architecture.

## Experience

- ${DIMAGI.name} (${DIMAGI.period}, ${DIMAGI.location}) — ${DIMAGI.url}
- ${XCALIBER.name} (${XCALIBER.period}, ${XCALIBER.location}) — ${XCALIBER.url}

## Projects

- [${PROJECT_ECOMMERCE.title}](${PROJECT_ECOMMERCE.githubUrl})
- [${PROJECT_ESTORE.title}](${PROJECT_ESTORE.githubUrl})
- [${PROJECT_BOOKSTORE.title}](${PROJECT_BOOKSTORE.githubUrl}) — demo: ${PROJECT_BOOKSTORE.demoUrl}

## Links

- Portfolio: ${SITE_URL}/
- GitHub: ${GITHUB_URL}
- LinkedIn: ${LINKEDIN_URL}
- Stack Overflow: ${SO_URL}
- Email: ${EMAIL}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
