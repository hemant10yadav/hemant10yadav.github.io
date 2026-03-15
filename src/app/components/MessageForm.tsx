'use client';

import { useState } from 'react';
import { event } from 'nextjs-google-analytics';
import { ViewerType } from '../context/ViewerContext';
import { CONTACT_SCRIPT_URL } from '../constants';

interface Props {
  viewerType: NonNullable<ViewerType>;
  accent: string;
}

const SCRIPT_URL = CONTACT_SCRIPT_URL;

const SUCCESS_CONTENT = {
  recruiter: {
    icon: '✓',
    heading: 'Message received.',
    body: "I'll follow up within 24 hours.",
    again: 'Send another',
  },
  developer: {
    icon: '>_',
    heading: 'Message sent.',
    body: "I'll reply. Give me a bit to form an opinion.",
    again: 'send another',
  },
};

const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const MessageForm = ({ viewerType, accent }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [focused, setFocused] = useState<string | null>(null);

  const isRecruiter = viewerType === 'recruiter';

  const validate = (name: string, value: string): string => {
    if (!value.trim()) return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    if (name === 'email' && !validateEmail(value)) return 'Enter a valid email address';
    if (name === 'name' && value.trim().length < 2) return 'At least 2 characters';
    if (name === 'message' && value.trim().length < 5) return 'At least 5 characters';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    setFocused(null);
  };

  const handleSubmit = async () => {
    const nameErr = validate('name', formData.name);
    const emailErr = validate('email', formData.email);
    const msgErr = validate('message', formData.message);
    setErrors({ name: nameErr, email: emailErr, message: msgErr });
    if (nameErr || emailErr || msgErr) return;

    setSubmitting(true);
    try {
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: new URLSearchParams(formData),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setErrors({ name: '', email: '', message: '' });
        event('contact_form_submitted', { category: 'Contact', label: viewerType, value: 1 });
      } else {
        alert('Failed to send. Please try again.');
      }
    } catch {
      alert('Failed to send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (fieldName: string): React.CSSProperties => ({
    width: '100%',
    padding: '0.7rem 1rem',
    background: 'var(--bg-input)',
    border: `1px solid ${
      errors[fieldName as keyof typeof errors]
        ? '#ef4444'
        : focused === fieldName
        ? `${accent}60`
        : 'var(--border-2)'
    }`,
    borderRadius: '8px',
    color: 'var(--fg)',
    fontSize: '0.875rem',
    outline: 'none',
    fontFamily: 'var(--font-inter), sans-serif',
    transition: 'border-color 0.2s',
    resize: 'none' as const,
  });

  if (submitted) {
    const s = SUCCESS_CONTENT[viewerType];
    return (
      <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
        <div
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: isRecruiter ? '2rem' : '1.1rem',
            color: accent,
            marginBottom: '0.75rem',
            letterSpacing: isRecruiter ? 'normal' : '0.05em',
          }}
        >
          {s.icon}
        </div>
        <p
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            color: 'var(--fg)',
            fontSize: '1rem',
            fontWeight: 600,
            marginBottom: '0.35rem',
          }}
        >
          {s.heading}
        </p>
        <p style={{ color: 'var(--fg-3)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>{s.body}</p>
        <button
          onClick={() => setSubmitted(false)}
          style={{
            background: 'none',
            border: `1px solid ${accent}40`,
            color: accent,
            padding: '0.4rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '0.8rem',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = `${accent}80`)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = `${accent}40`)}
        >
          {s.again}
        </button>
      </div>
    );
  }

  const fields: Array<{
    name: keyof typeof formData;
    placeholder: string;
    type?: string;
    rows?: number;
  }> = [
    {
      name: 'name',
      placeholder: isRecruiter ? 'Your name' : 'your name',
    },
    {
      name: 'email',
      placeholder: isRecruiter ? 'Your email' : 'your email',
      type: 'email',
    },
    {
      name: 'message',
      placeholder: isRecruiter
        ? 'Tell me about the role or project...'
        : "what's on your mind?",
      rows: 4,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {fields.map(({ name, placeholder, type, rows }) => (
        <div key={name}>
          {rows ? (
            <textarea
              name={name}
              value={formData[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={() => setFocused(name)}
              placeholder={placeholder}
              rows={rows}
              style={inputStyle(name)}
            />
          ) : (
            <input
              type={type ?? 'text'}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={() => setFocused(name)}
              placeholder={placeholder}
              style={inputStyle(name)}
            />
          )}
          {errors[name] && (
            <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.3rem' }}>
              {errors[name]}
            </p>
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '8px',
          background: accent,
          color: '#000',
          fontWeight: 700,
          fontSize: '0.9rem',
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          border: 'none',
          cursor: submitting ? 'not-allowed' : 'pointer',
          opacity: submitting ? 0.65 : 1,
          transition: 'opacity 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          letterSpacing: '0.02em',
        }}
        onMouseEnter={(e) => {
          if (!submitting) (e.currentTarget as HTMLButtonElement).style.opacity = '0.85';
        }}
        onMouseLeave={(e) => {
          if (!submitting) (e.currentTarget as HTMLButtonElement).style.opacity = '1';
        }}
      >
        {submitting && (
          <svg
            style={{ animation: 'spin 1s linear infinite', width: '1rem', height: '1rem' }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {submitting ? 'Sending...' : isRecruiter ? 'Send Message' : 'send it'}
      </button>
    </div>
  );
};
