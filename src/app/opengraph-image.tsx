import { ImageResponse } from 'next/og';
import { FULL_NAME, TITLE, GITHUB_USERNAME, PROFILE_PIC_URL } from './constants';

// Duplicated from context/ViewerContext.tsx (RECRUITER_ACCENT) — that module is
// 'use client' and can't be imported into this Node-runtime image generator.
const ACCENT = '#f2c078';

const STACK = ['Python', 'Java', 'JavaScript', 'React', 'Node.js', 'AWS'];

export const alt = `${FULL_NAME} — ${TITLE}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-static';

async function loadGoogleFont(family: string, weight: number, text: string) {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`
    )
  ).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error(`could not resolve font asset for ${family}`);
  const res = await fetch(match[1]);
  return res.arrayBuffer();
}

async function loadAvatar() {
  const res = await fetch(PROFILE_PIC_URL);
  const buf = await res.arrayBuffer();
  const base64 = Buffer.from(buf).toString('base64');
  const contentType = res.headers.get('content-type') ?? 'image/png';
  return `data:${contentType};base64,${base64}`;
}

export default async function OpengraphImage() {
  const monoText = `$~/whoamicatstack.txtgitremote-vgithub.com/${GITHUB_USERNAME}${TITLE}${STACK.join('')}developer view`;

  const [outfitBold, monoRegular, monoMedium, avatarSrc] = await Promise.all([
    loadGoogleFont('Outfit', 700, FULL_NAME),
    loadGoogleFont('JetBrains Mono', 400, monoText),
    loadGoogleFont('JetBrains Mono', 500, monoText),
    loadAvatar(),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          padding: '44px',
          background: 'linear-gradient(135deg, #05070c 0%, #080c14 55%, #0d1220 100%)',
          overflow: 'hidden',
        }}
      >
        {/* ambient glows */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: -160,
            left: -120,
            width: 620,
            height: 620,
            borderRadius: 310,
            background: `radial-gradient(circle, ${ACCENT}26 0%, transparent 68%)`,
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: -200,
            right: -140,
            width: 560,
            height: 560,
            borderRadius: 280,
            background: 'radial-gradient(circle, #22d3ee14 0%, transparent 70%)',
          }}
        />

        {/* terminal window */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.10)',
            background: '#0b0f18',
            overflow: 'hidden',
          }}
        >
          {/* title bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '0 22px',
              height: 52,
              background: 'rgba(255,255,255,0.025)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', width: 13, height: 13, borderRadius: 7, background: '#ff5f57', marginRight: 8 }} />
              <div style={{ display: 'flex', width: 13, height: 13, borderRadius: 7, background: '#febc2e', marginRight: 8 }} />
              <div style={{ display: 'flex', width: 13, height: 13, borderRadius: 7, background: '#28c840' }} />
            </div>
            <div
              style={{
                display: 'flex',
                flexGrow: 1,
                justifyContent: 'center',
                fontFamily: 'JetBrains Mono',
                fontWeight: 400,
                fontSize: 15,
                color: '#7d8695',
              }}
            >
              hemant@portfolio — zsh
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', width: 7, height: 7, borderRadius: 4, background: ACCENT, marginRight: 8 }} />
              <div style={{ display: 'flex', fontFamily: 'JetBrains Mono', fontWeight: 400, fontSize: 14, color: ACCENT }}>
                developer view
              </div>
            </div>
          </div>

          {/* body */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              padding: '40px 54px 36px',
            }}
          >
            {/* profile row */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
              <div
                style={{
                  display: 'flex',
                  width: 104,
                  height: 104,
                  borderRadius: 52,
                  border: `2px solid ${ACCENT}88`,
                  overflow: 'hidden',
                  marginRight: 30,
                  flexShrink: 0,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatarSrc} width={104} height={104} style={{ objectFit: 'cover' }} alt="" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    display: 'flex',
                    fontFamily: 'JetBrains Mono',
                    fontWeight: 400,
                    fontSize: 21,
                    color: ACCENT,
                    marginBottom: 10,
                  }}
                >
                  $ whoami
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontFamily: 'Outfit',
                    fontWeight: 700,
                    fontSize: 54,
                    lineHeight: 1.05,
                    color: '#f8fafc',
                  }}
                >
                  {FULL_NAME}
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontFamily: 'JetBrains Mono',
                    fontWeight: 400,
                    fontSize: 22,
                    color: '#94a3b8',
                    marginTop: 6,
                  }}
                >
                  {TITLE}
                </div>
              </div>
            </div>

            {/* stack pills */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'auto' }}>
              {STACK.map((tech, i) => (
                <div
                  key={tech}
                  style={{
                    display: 'flex',
                    fontFamily: 'JetBrains Mono',
                    fontWeight: 500,
                    fontSize: 16,
                    color: '#c7cdd6',
                    background: 'rgba(255,255,255,0.035)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 999,
                    padding: '7px 16px',
                    marginRight: i === STACK.length - 1 ? 0 : 10,
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>

            {/* contact line */}
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 28 }}>
              <div
                style={{
                  display: 'flex',
                  fontFamily: 'JetBrains Mono',
                  fontWeight: 400,
                  fontSize: 16,
                  color: '#5b6577',
                  marginBottom: 6,
                }}
              >
                $ git remote -v
              </div>
              <div
                style={{
                  display: 'flex',
                  fontFamily: 'JetBrains Mono',
                  fontWeight: 500,
                  fontSize: 22,
                  color: '#e2e8f0',
                }}
              >
                github.com/{GITHUB_USERNAME}
              </div>
            </div>
          </div>

          {/* accent bar */}
          <div style={{ display: 'flex', width: '100%', height: 4, background: ACCENT }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Outfit', data: outfitBold, weight: 700, style: 'normal' },
        { name: 'JetBrains Mono', data: monoRegular, weight: 400, style: 'normal' },
        { name: 'JetBrains Mono', data: monoMedium, weight: 500, style: 'normal' },
      ],
    }
  );
}
