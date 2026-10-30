import { useRef } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';

import teamImg from '../assets/images/team_meeting.jpg';
import { COMPANY_INFO, CORE_VALUES } from '../data/companyData';
import { useWeichieScrollAnimations } from '../hooks/useWeichieScrollAnimations';

export default function AboutPage() {
  const pageRef = useRef(null);
  useWeichieScrollAnimations(pageRef);

  const scheduleStages = [
    { day: 'Phase 1', focus: 'Discovery & Architecture', details: 'Analyze client workflows, gather specifications, define technical scope, and establish delivery plan.' },
    { day: 'Phase 2', focus: 'System & UI/UX Design', details: 'Develop information architecture, user journeys, secure API models, and interactive design prototypes.' },
    { day: 'Phase 3', focus: 'Core Engineering', details: 'Build resilient backends, responsive interfaces, cloud integrations, and robust business logic.' },
    { day: 'Phase 4', focus: 'Testing & Hardening', details: 'Conduct unit tests, security audits, performance profiling, and cross-platform verification.' },
    { day: 'Phase 5', focus: 'Deployment & CI/CD', details: 'Provision scalable cloud infrastructure, automate deployment pipelines, and configure monitoring.' },
    { day: 'Phase 6', focus: 'Support & Evolution', details: 'Provide continuous SLA maintenance, proactive health monitoring, and iterative feature scaling.' }
  ];

  return (
    <div ref={pageRef} style={{ paddingTop: '5.5rem' }}>
      {/* Intro Heading */}
      <section className="section">
        <div className="wrap">
          <small className="label" data-reveal>About Yakunex Technologies (Pvt) Ltd</small>
          <h1 className="big" style={{ marginBottom: '2rem' }} data-text-reveal>
            Who we are
          </h1>

          <div className="split three" data-reveal-stagger>
            <div>
              <h3>Introduction</h3>
              <p>
                Yakunex Technologies (Pvt) Ltd provides IT services and solutions that help businesses and individuals solve practical problems, from bespoke software and web platforms to cloud infrastructure, cybersecurity and artificial intelligence.
              </p>
            </div>
            <div>
              <h3>Vision</h3>
              <p>{COMPANY_INFO.vision}</p>
            </div>
            <div>
              <h3>Mission</h3>
              <p>{COMPANY_INFO.mission}</p>
            </div>
          </div>

          <div data-parallax-image style={{ marginTop: '3.5rem', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--line)', maxHeight: '460px', boxShadow: 'var(--shadow-subtle)' }}>
            <img
              src={teamImg}
              alt="Yakunex Technologies engineering team reviewing architectural systems"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Core Values 7 Pillars */}
      <section className="section sand">
        <div className="wrap">
          <small className="label" data-reveal>Ethical & Engineering Foundation</small>
          <h2 data-text-reveal>The seven principles we uphold</h2>
          <p className="muted" style={{ maxWidth: '58ch', margin: '0.8rem 0 3rem' }} data-reveal>
            As detailed in our corporate engineering charter, these seven values guide our software engineering quality, transparency, and ongoing professional growth.
          </p>

          <ul className="values" data-reveal-stagger>
            {CORE_VALUES.map((val, idx) => (
              <li key={val.id}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--terracotta)', marginBottom: '0.4rem', letterSpacing: '0.06em' }}>
                  0{idx + 1}
                </div>
                <b>{val.title}</b>
                <span>{val.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Governance & Leadership */}
      <section className="section">
        <div className="wrap split">
          <div>
            <small className="label" data-reveal>Leadership & Governance</small>
            <h2 data-text-reveal>Authorized leadership</h2>
            <p className="muted about-leadership-intro" data-reveal>
              The people responsible for the company’s direction, engineering standards, and long-term trust with every partner.
            </p>
          </div>

          <div className="about-leadership-list" data-reveal-stagger>
            {COMPANY_INFO.leadership.map((leader, index) => (
              <article className="about-leader-row" key={leader.name}>
                <div className="about-leader-portrait">
                  <div className="portrait-placeholder portrait-placeholder--compact" role="img" aria-label={leader.portraitAlt}>
                    {leader.portrait ? (
                      <img src={leader.portrait} alt={leader.portraitAlt} />
                    ) : (
                      <span aria-hidden="true">{leader.initials}</span>
                    )}
                  </div>
                  <span className="portrait-index">0{index + 1}</span>
                </div>
                <div className="about-leader-copy">
                  <span className="team-badge">{leader.role}</span>
                  <h3>{leader.name}</h3>
                  <p>{leader.bio}</p>
                  <small className="media-status">{leader.portraitStatus}</small>
                  <p className="leader-detail">
                    {index === 0 ? `Registered Office: ${COMPANY_INFO.address.full}` : 'Engineering & Technology Standards'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Software Delivery Lifecycle */}
      <section className="section sand">
        <div className="wrap">
          <small className="label" data-reveal>Engineering Methodology</small>
          <h2 data-text-reveal>Development lifecycle</h2>
          <p className="muted" style={{ marginBottom: '3rem' }} data-reveal>
            The agile sprint roadmap followed by Yakunex Technologies for high-quality software execution.
          </p>

          <div data-reveal-stagger style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {scheduleStages.map((stage) => (
              <div key={stage.day} className="service-editorial-card">
                <span className="pill terracotta-tag" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                  {stage.day}
                </span>
                <h3>{stage.focus}</h3>
                <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>{stage.details}</p>
              </div>
            ))}
          </div>

          <div className="center" style={{ marginTop: '3.5rem' }} data-reveal>
            <Link to="/contact" className="pill dark">
              Get in touch with our team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
