import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { COMPANY_INFO } from '../../data/companyData';
import logoImg from '../../assets/logo.png';
import { useWeichieScrollAnimations } from '../../hooks/useWeichieScrollAnimations';

export default function Footer() {
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useWeichieScrollAnimations(footerRef);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className={isVisible ? 'visible' : ''}>
      <div className="wrap">
        {/* Office Card */}
        <div className="office" data-reveal>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
            <h3 style={{ margin: 0 }}>Visit our Headquarters</h3>
            <a
              href="https://maps.google.com/?q=NO:+280/A,+Ilukwaththa,+Kadugannawa,+Kandy,+Sri+Lanka"
              target="_blank"
              rel="noopener noreferrer"
              className="pill terracotta-tag"
              style={{ fontSize: '0.74rem', padding: '0.24rem 0.75rem', gap: '5px' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              View on Map ↗
            </a>
          </div>
          <p>{COMPANY_INFO.address.full}</p>
          <small style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1.25rem', marginTop: '0.8rem' }}>
            <span>
              Email:{' '}
              <a href={`mailto:${COMPANY_INFO.contacts.email}`} style={{ color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                {COMPANY_INFO.contacts.email}
              </a>
            </span>
            <span>
              Tel:{' '}
              <a href={`tel:${COMPANY_INFO.contacts.phone.replace(/[^0-9+]/g, '')}`} style={{ color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                {COMPANY_INFO.contacts.phone}
              </a>
            </span>
          </small>
        </div>

        {/* 4-Column Editorial Links */}
        <div className="fcols" data-reveal-stagger>
          <div>
            {/* Footer Brand with Logo */}
            <div className="footer-brand">
              <img src={logoImg} alt="Yakunex" className="footer-logo-img" />
              <b>Yakunex Technologies</b>
            </div>
            <p style={{ marginTop: '0.8rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Yakunex Technologies (Pvt) Ltd delivers dependable IT solutions and bespoke software for businesses and individuals, engineering for long-term growth.
            </p>

            {/* Social Media Channels */}
            <div className="footer-socials" aria-label="Yakunex Social Channels">
              <a
                href={COMPANY_INFO.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Yakunex on LinkedIn"
                title="LinkedIn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
              <a
                href={COMPANY_INFO.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Yakunex on GitHub"
                title="GitHub"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
              <a
                href={COMPANY_INFO.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Yakunex on X (Twitter)"
                title="X (Twitter)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href={COMPANY_INFO.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Yakunex on Facebook"
                title="Facebook"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a
                href={COMPANY_INFO.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Yakunex on Instagram"
                title="Instagram"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          <ul>
            <li><b>Company</b></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/portfolio">Latest Work</Link></li>
            <li><Link to="/careers">Careers & Internships</Link></li>
            <li><Link to="/contact">Send an inquiry</Link></li>
          </ul>

          <ul>
            <li><b>Expertise</b></li>
            <li><Link to="/services">Software & Desktop</Link></li>
            <li><Link to="/services">Web & Mobile Apps</Link></li>
            <li><Link to="/services">Cloud & DevOps</Link></li>
            <li><Link to="/services">Cybersecurity</Link></li>
            <li><Link to="/services">Artificial Intelligence</Link></li>
          </ul>

          <ul>
            <li><b>Corporate Leadership</b></li>
            <li>Director: {COMPANY_INFO.leadership[0].name}</li>
            <li>Tech Lead: {COMPANY_INFO.leadership[1].name}</li>
            <li>Headquarters: Kadugannawa, Kandy</li>
          </ul>
        </div>

        {/* Copyright */}
        <p className="copy">
          © {new Date().getFullYear()} Yakunex Technologies (Pvt) Ltd • All Rights Reserved
        </p>

        {/* Colossal Edge-to-Edge Brand Signature (Next Level Animation) */}
        <div className="mark" aria-hidden="true">
          {"Yakunex".split("").map((char, index) => (
            <span key={index} className="mark-char" style={{ "--yx-i": index }}>
              {char}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
