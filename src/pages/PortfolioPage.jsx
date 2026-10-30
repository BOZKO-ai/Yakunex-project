import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PORTFOLIO_PROJECTS } from '../data/companyData';
import { useWeichieScrollAnimations } from '../hooks/useWeichieScrollAnimations';

import retailImg from '../assets/images/project_retail.jpg';
import clinicImg from '../assets/images/project_clinic.jpg';
import cloudImg from '../assets/images/project_cloud.jpg';
import ecommerceImg from '../assets/images/project_ecommerce.jpg';
import teamImg from '../assets/images/team_meeting.jpg';

const PROJECT_IMAGE_MAP = {
  'project-pos': retailImg,
  'project-clinic': clinicImg,
  'project-cloud-monitor': cloudImg,
  'project-ecommerce': ecommerceImg,
  'project-ai-bot': teamImg,
  'project-sec-audit': cloudImg
};

export default function PortfolioPage() {
  const pageRef = useRef(null);
  useWeichieScrollAnimations(pageRef);

  const [activeModal, setActiveModal] = useState(null);

  return (
    <div ref={pageRef} style={{ paddingTop: '6rem' }}>
      <section className="section">
        <div className="wrap">
          <small className="label" data-reveal>Featured Engineering Work</small>
          <h1 className="big" style={{ marginBottom: '1.2rem' }} data-text-reveal>
            Some of our latest ideas
          </h1>
          <p className="lead" style={{ margin: '0 0 4.5rem 0', maxWidth: '64ch' }} data-reveal>
            A showcase of robust enterprise solutions, full-stack web applications, cloud architectures, and digital platforms engineered by Yakunex Technologies.
          </p>

          {/* Staggered Editorial Asymmetrical Gallery */}
          <div className="editorial-gallery" data-reveal-stagger>
            {PORTFOLIO_PROJECTS.map((proj, idx) => {
              const imageSrc = PROJECT_IMAGE_MAP[proj.id] || retailImg;
              const formattedIdx = `0${idx + 1} / 0${PORTFOLIO_PROJECTS.length}`;

              return (
                <article key={proj.id} className="gallery-card">
                  <div className="editorial-frame" data-parallax-image>
                    <img src={imageSrc} alt={proj.title} loading="lazy" />
                    <span className="badge-tag-editorial">{proj.badge}</span>
                  </div>

                  <div className="editorial-meta">
                    <div className="project-idx">{formattedIdx}</div>
                    <h3>{proj.title}</h3>
                    <small>{proj.category}</small>
                    <p>{proj.description}</p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', margin: '0.8rem 0 1.2rem' }}>
                      {proj.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          style={{
                            background: 'var(--sand)',
                            border: '1px solid var(--line)',
                            padding: '0.22rem 0.65rem',
                            borderRadius: '999px',
                            fontSize: '0.76rem',
                            color: 'var(--muted)'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div>
                      <button
                        type="button"
                        className="pill light"
                        style={{ fontSize: '0.82rem', padding: '0.45rem 1.1rem' }}
                        onClick={() => setActiveModal(proj)}
                      >
                        View architecture
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="center" data-reveal>
            <Link to="/contact" className="pill dark">
              Discuss your project
            </Link>
          </div>
        </div>
      </section>

      {/* Blueprint Architecture Modal */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setActiveModal(null)}
              aria-label="Close"
            >
              ✕
            </button>

            <span className="pill terracotta-tag" style={{ marginBottom: '1rem', display: 'inline-block' }}>
              {activeModal.badge}
            </span>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{activeModal.title}</h2>
            <p style={{ color: 'var(--terracotta)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.2rem' }}>
              {activeModal.category}
            </p>
            <p style={{ color: 'var(--ink)', fontSize: '1.02rem', lineHeight: '1.7', marginBottom: '1.8rem' }}>
              {activeModal.description}
            </p>

            <div style={{ background: 'var(--sand)', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.8rem', border: '1px solid var(--line)' }}>
              <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.8rem', color: 'var(--ink)' }}>
                Engineering Highlights:
              </h4>
              <ul className="dots">
                {activeModal.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
              {activeModal.techStack.map((tech) => (
                <span
                  key={tech}
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--line)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    color: 'var(--muted)'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
              <button
                type="button"
                className="pill light"
                onClick={() => setActiveModal(null)}
              >
                Close
              </button>
              <Link
                to={`/contact?inquiryType=Project&project=${encodeURIComponent(activeModal.title)}`}
                className="pill dark"
                onClick={() => setActiveModal(null)}
              >
                Inquire about this
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
