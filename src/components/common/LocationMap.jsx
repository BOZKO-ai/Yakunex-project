import { useState } from 'react';
import { COMPANY_INFO } from '../../data/companyData';

export default function LocationMap({ className = '', style = {} }) {
  const [copied, setCopied] = useState(false);

  const mapQuery = encodeURIComponent(COMPANY_INFO.address.full);
  const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  const directionsUrl = `https://maps.google.com/?q=${mapQuery}`;

  const copyAddress = () => {
    navigator.clipboard.writeText(COMPANY_INFO.address.full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className={`location-map-card ${className}`}
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-xl)',
        padding: 'clamp(1.2rem, 3vw, 1.8rem)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        ...style
      }}
    >
      {/* Header bar with badges and action buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.2rem'
        }}
      >
        <div>
          <span
            className="pill terracotta-tag"
            style={{ marginBottom: '0.45rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--brand-gold)',
                display: 'inline-block'
              }}
            />
            Corporate Headquarters
          </span>
          <h3 style={{ fontSize: '1.25rem', margin: '0.2rem 0', fontWeight: 600 }}>
            Kadugannawa Office, Kandy
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: 0 }}>
            {COMPANY_INFO.address.full}
          </p>
        </div>

        {/* Action button suite */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={copyAddress}
            className="pill light"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.95rem', gap: '6px' }}
            title="Copy address to clipboard"
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy Address
              </>
            )}
          </button>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pill dark"
            style={{ fontSize: '0.8rem', padding: '0.45rem 1.1rem', gap: '6px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 11l19-9-9 19-2-8-8-2z" />
            </svg>
            Get Directions ↗
          </a>
        </div>
      </div>

      {/* Embedded Interactive Map Frame */}
      <div
        className="map-frame-wrap"
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(260px, 34vw, 380px)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--line)',
          background: 'var(--sand)'
        }}
      >
        <iframe
          title="Yakunex Technologies Office Location"
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{
            border: 0,
            display: 'block',
            filter: 'var(--map-filter, none)'
          }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Ambient floating pin pill on top of the map */}
        <div
          style={{
            position: 'absolute',
            bottom: '14px',
            left: '14px',
            background: 'var(--card-bg)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-pill)',
            padding: '0.35rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-floating)',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--ink)'
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--brand-gold)',
              boxShadow: '0 0 8px var(--brand-gold)'
            }}
          />
          Yakunex Technologies (Pvt) Ltd
        </div>
      </div>

      {/* Quick Location Meta Info */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginTop: '1.2rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--line-fine)',
          fontSize: '0.85rem',
          color: 'var(--muted)'
        }}
      >
        <div>
          <span style={{ display: 'block', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.2rem' }}>
            Office Hours
          </span>
          {COMPANY_INFO.contacts.workingHours}
        </div>
        <div>
          <span style={{ display: 'block', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.2rem' }}>
            Direct Telephony
          </span>
          <a href={`tel:${COMPANY_INFO.contacts.phone.replace(/[^0-9+]/g, '')}`} style={{ color: 'var(--ink)' }}>
            {COMPANY_INFO.contacts.phone}
          </a>
        </div>
        <div>
          <span style={{ display: 'block', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.2rem' }}>
            Official Correspondence
          </span>
          <a href={`mailto:${COMPANY_INFO.contacts.email}`} style={{ color: 'var(--ink)' }}>
            {COMPANY_INFO.contacts.email}
          </a>
        </div>
      </div>
    </div>
  );
}
