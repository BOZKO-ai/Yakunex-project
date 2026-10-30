import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useWeichieScrollAnimations } from '../hooks/useWeichieScrollAnimations';
import {
  Code2,
  Globe,
  Smartphone,
  Palette,
  Cpu,
  Cloud,
  ShieldCheck,
  Server,
  Database,
  ShoppingBag,
  HelpCircle,
  TrendingUp,
  Radio,
  CheckCircle2,
  Workflow,
  GraduationCap,
  Search,
  X
} from 'lucide-react';
import { SERVICES, SERVICE_CATEGORIES } from '../data/companyData';

const ICON_MAP = {
  Code2,
  Globe,
  Smartphone,
  Palette,
  Cpu,
  Cloud,
  ShieldCheck,
  Server,
  Database,
  ShoppingBag,
  HelpCircle,
  TrendingUp,
  Radio,
  CheckCircle2,
  Workflow,
  GraduationCap
};

const CATEGORY_TAG_CLASS = {
  'Software & Apps': 'tag-software',
  'Web & Cloud': 'tag-web',
  'AI & Data': 'tag-ai',
  'Infrastructure & Security': 'tag-infra',
  'Consulting & Growth': 'tag-consulting'
};

export default function ServicesPage() {
  const searchInputRef = useRef(null);
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All Services';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);

  const pageRef = useRef(null);

  // Keyboard shortcut: "/" focuses search, Esc clears it
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useWeichieScrollAnimations(pageRef, [activeCategory, searchQuery]);

  const filteredServices = useMemo(() => {
    return SERVICES.filter((service) => {
      const matchesCategory =
        activeCategory === 'All Services' || service.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        service.title.toLowerCase().includes(q) ||
        service.shortDesc.toLowerCase().includes(q) ||
        service.fullDesc.toLowerCase().includes(q) ||
        service.subServices.some((sub) => sub.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div ref={pageRef} style={{ paddingTop: '6rem' }}>
      <Helmet>
        <title>Services | Yakunex Technologies - Digital Engineering Solutions</title>
        <meta name="description" content="Explore our 16 specialized IT services: Custom Software, Web Development, Cloud DevOps, AI, and Cybersecurity tailored for enterprise resilience." />
        <meta property="og:title" content="Expert IT Services - Yakunex Technologies" />
        <meta property="og:description" content="Professional software engineering and digital transformation services in Sri Lanka." />
      </Helmet>
      <section className="section">
        <div className="wrap">
          <small className="label" data-reveal>Capabilities Overview</small>
          <h1 className="big" style={{ marginBottom: '1.2rem' }} data-text-reveal>
            All 16 IT services
          </h1>
          <p className="lead" style={{ margin: '0 0 3.5rem 0', maxWidth: '64ch' }} data-reveal>
            Explore our comprehensive portfolio of 16 specialized IT services, covering enterprise software, cloud infrastructure, AI solutions, and digital transformation.
          </p>

          {/* Integrated Editorial Search Bar */}
          <div className="editorial-search-bar" data-reveal>
            <Search size={18} color="var(--subtle)" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services or technologies (e.g. React, Cloud, POS, AI)..."
              aria-label="Search services"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear"
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills with Item Counts */}
          <div className="editorial-filter-bar" data-reveal>
            {SERVICE_CATEGORIES.map((cat) => {
              const count =
                cat === 'All Services'
                  ? SERVICES.length
                  : SERVICES.filter((s) => s.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  <span>{cat === 'All Services' ? 'All Services' : cat}</span>
                  <span style={{ opacity: 0.65, fontSize: '0.8em' }}>({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search Result Counter */}
          <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--subtle)', fontSize: '0.88rem' }}>
            <span>
              Showing <strong>{filteredServices.length}</strong> of <strong>{SERVICES.length}</strong> services
            </span>
            {searchQuery && (
              <span>Filtered by "{searchQuery}"</span>
            )}
          </div>

          {/* Service Cards Grid */}
          <div data-reveal-stagger style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2.2rem' }}>
            {filteredServices.map((service, index) => {
              const IconComponent = ICON_MAP[service.icon] || Code2;
              const tagClass = CATEGORY_TAG_CLASS[service.category] || 'tag-software';
              const formattedIdx = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;

              return (
                <div key={service.id} className="service-editorial-card">
                  <div>
                    <div className="service-top-bar">
                      <span className={`category-tag ${tagClass}`}>
                        {service.category}
                      </span>
                      <span className="service-number">{formattedIdx}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          background: 'var(--sand)',
                          display: 'grid',
                          placeItems: 'center',
                          color: 'var(--ink)'
                        }}
                      >
                        <IconComponent size={20} strokeWidth={1.75} />
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{service.title}</h3>
                    </div>

                    <p style={{ fontSize: '0.92rem', color: 'var(--muted)', marginBottom: '1.4rem' }}>
                      {service.shortDesc}
                    </p>

                    <ul className="service-sublist">
                      {service.subServices.slice(0, 3).map((sub, i) => (
                        <li key={i}>{sub}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="service-actions">
                    <button
                      type="button"
                      className="pill light"
                      style={{ flex: 1, fontSize: '0.82rem', padding: '0.45rem 0.8rem' }}
                      onClick={() => setActiveModal(service)}
                    >
                      Specifications
                    </button>
                    <Link
                      to={`/contact?service=${service.id}`}
                      className="pill dark"
                      style={{ fontSize: '0.82rem', padding: '0.45rem 1.1rem' }}
                    >
                      Inquire
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredServices.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem 1rem', background: 'var(--sand)', borderRadius: '24px' }}>
              <h3 style={{ marginBottom: '0.8rem' }}>No services match your query</h3>
              <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
                Try searching for another keyword or clear your active category filter.
              </p>
              <button
                type="button"
                className="pill dark"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All Services');
                }}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modal Specification View */}
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

            <span className={`category-tag ${CATEGORY_TAG_CLASS[activeModal.category] || 'tag-software'}`} style={{ marginBottom: '1rem', display: 'inline-block' }}>
              {activeModal.category}
            </span>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{activeModal.title}</h2>
            <p style={{ color: 'var(--ink)', fontSize: '1.02rem', lineHeight: '1.7', marginBottom: '1.6rem' }}>
              {activeModal.fullDesc}
            </p>

            <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--terracotta)' }}>
              Sub-services & Core Deliverables:
            </h4>
            <ul className="dots" style={{ marginBottom: '2.2rem' }}>
              {activeModal.subServices.map((sub, i) => (
                <li key={i}>
                  <b>{sub}</b>
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
              <button
                type="button"
                className="pill light"
                onClick={() => setActiveModal(null)}
              >
                Close
              </button>
              <Link
                to={`/contact?service=${activeModal.id}`}
                className="pill dark"
                onClick={() => setActiveModal(null)}
              >
                Request Consultation
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
