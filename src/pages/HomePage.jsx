import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import emailjs from '@emailjs/browser';
import logoImg from '../assets/logo.png';

import retailImg from '../assets/images/project_retail.jpg';
import clinicImg from '../assets/images/project_clinic.jpg';
import cloudImg from '../assets/images/project_cloud.jpg';
import ecommerceImg from '../assets/images/project_ecommerce.jpg';
import teamImg from '../assets/images/team_meeting.jpg';
import CurvedCarousel from '../components/common/CurvedCarousel';
import MagneticHeading from '../components/common/MagneticHeading';
import { useWeichieScrollAnimations } from '../hooks/useWeichieScrollAnimations';
import {
  COMPANY_INFO,
  CUSTOMER_REVIEWS,
  SERVICES,
  PORTFOLIO_PROJECTS,
  STATS
} from '../data/companyData';
import { Users, Briefcase, TrendingUp, Star, ShieldCheck } from 'lucide-react';

const TYPE_ICON = {
  Users: Users,
  Briefcase: Briefcase,
  TrendingUp: TrendingUp,
};

function Counter({ value, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    let totalMiliseconds = duration;
    let incrementTime = (totalMiliseconds / end) > 10 ? (totalMiliseconds / end) : 10;

    let timer = setInterval(() => {
      start += Math.ceil(end / (duration / incrementTime));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [hasStarted, value, duration]);

  return (
    <span ref={countRef} style={{ display: 'inline-block', minWidth: '2ch' }}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const HERO_CAROUSEL_ITEMS = [
  {
    src: retailImg,
    title: 'NexusPOS & Stock Intelligence',
    category: 'Software & Inventory',
    badge: 'Enterprise POS',
  },
  {
    src: clinicImg,
    title: 'MediCare Portal & Tele-Booking',
    category: 'Healthcare & Web App',
    badge: 'Mobile & Web',
  },
  {
    src: logoImg,
    title: 'Yakunex Neural Core',
    category: 'Intelligent Systems Architecture',
    badge: 'Core Intelligence',
    isEmblem: true,
  },
  {
    src: cloudImg,
    title: 'CloudSentinel Infrastructure',
    category: 'Cloud, DevOps & Containers',
    badge: 'Live Telemetry',
  },
  {
    src: ecommerceImg,
    title: 'ApexCart Headless Store',
    category: 'Digital Commerce & Payments',
    badge: 'E-Commerce',
  },
  {
    src: teamImg,
    title: 'Yakunex Engineering Lab',
    category: 'Custom Systems & Integration',
    badge: 'Bespoke Delivery',
  },
  {
    src: retailImg,
    title: 'Supply Chain Optimization',
    category: 'Logistics & AI',
    badge: 'AI Powered',
  },
  {
    src: cloudImg,
    title: 'DataSphere Analytics',
    category: 'Big Data & Insights',
    badge: 'Real-time',
  },
  {
    src: logoImg,
    title: 'Yakunex AI Hub',
    category: 'Cognitive Computing',
    badge: 'Next-Gen',
    isEmblem: true,
  },
];


const MARQUEE_TAGS = [
  'Custom software',
  'Web development',
  'Mobile apps',
  'Cloud & DevOps',
  'Cybersecurity',
  'Artificial intelligence',
  'Networking & infrastructure',
  'Database management',
  'UI/UX design',
  'Automation'
];

const SYSTEMS_DATA = [
  {
    title: 'Run on systems that work',
    text: 'Your website, shop or application is not a brochure. It is the operating core of your business, and we build it that way.',
    items: [
      ['Web platforms', 'Corporate sites, portals and dashboards built as infrastructure'],
      ['E-commerce', 'Online stores connected to payments, stock and delivery'],
      ['Applications', 'Custom, mobile and desktop software that replaces manual work']
    ]
  },
  {
    title: 'Connect what you already use',
    text: 'Most companies run on more tools than they can count, and few of them talk to each other. We join them up.',
    items: [
      ['Integrations', 'CRM, ERP, invoicing and marketing tools working as one'],
      ['APIs', 'Reliable connections and data flows between your systems'],
      ['Databases', 'Well-designed SQL and NoSQL storage with backup and recovery']
    ]
  },
  {
    title: 'Protect and automate',
    text: 'Secure foundations first, then automation for the repetitive work that slows your team down.',
    items: [
      ['Cybersecurity', 'Security audits, secure development, access control and monitoring'],
      ['Cloud and DevOps', 'Deployment, CI/CD, monitoring and disaster recovery'],
      ['AI and automation', 'Chatbots and workflows that replace manual steps']
    ]
  }
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function HomePage() {
  const heroRef = useRef(null);
  const contactRef = useRef(null);
  const pageRef = useRef(null);
  const [email, setEmail] = useState('');

  // Weichie-inspired GSAP ScrollTrigger animations
  useWeichieScrollAnimations(pageRef);

  // 3D tilt tracking for hero cards
  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    heroRef.current.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5) * 2);
    heroRef.current.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  const handleMouseLeave = () => {
    if (!heroRef.current) return;
    heroRef.current.style.setProperty('--mx', 0);
    heroRef.current.style.setProperty('--my', 0);
  };

  // "Tell us what you need" interactive state
  const [selectedServices, setSelectedServices] = useState(['software-dev', 'web-dev']);
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState({ name: '', email: '', msg: '', trap: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'

  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const chosenLabels = SERVICES.filter((s) => selectedServices.includes(s.id)).map((s) => s.title);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formState.trap) return; // bot trap
    const errs = {};
    if (!formState.name.trim()) errs.name = 'Please enter your name.';
    if (!EMAIL_REGEX.test(formState.email.trim())) errs.email = 'Please enter a valid email address.';
    if (formState.msg.trim().length < 10) errs.msg = 'Please write at least 10 characters about your project.';

    setFormErrors(errs);
    if (Object.keys(errs).length) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // NOTE: Replace these with your actual EmailJS credentials
      // await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
      //   from_name: formState.name,
      //   from_email: formState.email,
      //   message: formState.msg,
      //   services: chosenLabels.join(', '),
      // }, 'YOUR_PUBLIC_KEY');

      // Simulating a successful API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus('success');
      setStep(3);
    } catch (error) {
      console.error('EmailJS Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={pageRef}>
      <Helmet>
        <title>Yakunex Technologies | Innovating Today. Engineering Tomorrow.</title>
        <meta name="description" content="Yakunex Technologies (Pvt) Ltd provides bespoke software, web development, cloud solutions, and IT infrastructure services in Sri Lanka." />
        <meta name="keywords" content="Software Development Sri Lanka, Web Design Kandy, IT Infrastructure, Cloud DevOps, AI Automation" />
        <meta property="og:title" content="Yakunex Technologies - Digital Systems & Engineering" />
        <meta property="og:description" content="Dependable digital platforms and automated infrastructure for business operations." />
        <meta property="og:image" content="/logo.png" />
      </Helmet>
      {/* =========================================================================
          1. HERO SECTION — 3D PERSPECTIVE CURVED CAROUSEL SHOWCASE (Following hero.mp4)
          ========================================================================= */}
      <header className="hero" id="top">
        {/* Editorial Intro Typography */}
        <div className="intro">
          <small className="hero-eyebrow" data-reveal>
            <span className="hero-eyebrow-dot" />
            Yakunex Technologies (Pvt) Ltd • Digital Systems & Engineering
          </small>

          <MagneticHeading
            className="hero-title"
            lines={[
              { text: 'Innovating Today.' },
              { text: 'Engineering Tomorrow.', className: 'hero-title--accent' }
            ]}
          />

          <p className="hero-lead" data-reveal>
            We design and build dependable digital platforms, modern web solutions, and automated infrastructure that power business operations.
          </p>

          <div className="hero-ctas" data-reveal>
            <Link to="/services" className="pill dark">
              Explore Our Services
            </Link>
            <button
              className="pill light"
              onClick={() => contactRef.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              Let’s Talk
            </button>
          </div>
        </div>

        {/* ── 3D Curved Cylindrical Carousel Stage ── */}
        <div className="hero-carousel-stage">
          <CurvedCarousel items={HERO_CAROUSEL_ITEMS} bg="transparent" loading="lazy" />
        </div>

        {/* ── Marquee Ticker with Scroll Scrub Parallax ── */}
        <div className="marquee" aria-label="Company Capabilities Ticker">
          <div className="track" data-horizontal-parallax="-8">
            <ul>
              {MARQUEE_TAGS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <ul aria-hidden="true">
              {MARQUEE_TAGS.map((t) => (
                <li key={`clone-${t}`}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {/* ── Animated Stats Section ── */}
      <div className="stats-strip" data-reveal>
        <div className="wrap">
          <div className="stats-grid">
            {STATS.map((stat) => {
              const Icon = TYPE_ICON[stat.icon];
              return (
                <div key={stat.label} className="stat-card">
                  <div className="stat-icon">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-value">
                      <Counter value={stat.value} suffix={stat.suffix} />
                    </h3>
                    <p className="stat-label">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. WORK SECTION: Asymmetrical 3-Column Editorial Gallery
          ========================================================================= */}
      <section className="section sand work" id="work" aria-labelledby="work-heading">
        <div className="wrap">
          <h2 className="big" id="work-heading" data-text-reveal>
            Some of our latest work
          </h2>
          <p className="muted" style={{ marginBottom: '3rem' }} data-reveal>
            A curated selection of modern digital platforms and software systems engineered by our team.
          </p>

          <div className="grid3" data-reveal-stagger>
            {PORTFOLIO_PROJECTS.slice(0, 3).map((proj, idx) => {
              const projectImg = idx === 0 ? retailImg : idx === 1 ? clinicImg : cloudImg;
              return (
                <article key={proj.id}>
                  <div className="shot" role="img" aria-label={proj.title} data-parallax-image>
                    <img src={projectImg} alt={proj.title} loading="lazy" />
                    <b>{proj.badge}</b>
                  </div>
                  <div className="project-idx">0{idx + 1} / 06</div>
                  <h3>{proj.title}</h3>
                  <small>{proj.category}</small>
                  <p>{proj.description}</p>
                </article>
              );
            })}
          </div>

          <div className="center" data-reveal>
            <Link to="/portfolio" className="pill dark">
              View all portfolio projects
            </Link>
          </div>
        </div>
      </section>



      {/* =========================================================================
          3. SYSTEMS SECTION: Two-Column Editorial Layout with Golden Dots
          ========================================================================= */}
      <section className="section" id="systems" aria-labelledby="systems-heading">
        <div className="wrap split">
          <div>
            <small className="label" data-reveal>IT solutions company, Sri Lanka</small>
            <h2 id="systems-heading" data-text-reveal>
              We build systems your business runs on.
            </h2>
          </div>

          <div className="stack" data-reveal-stagger>
            {SYSTEMS_DATA.map((group, i) => (
              <div key={group.title} className="stack-item">
                <h3>{group.title}</h3>
                <p>{group.text}</p>
                <ul className="dots">
                  {group.items.map(([term, desc]) => (
                    <li key={term}>
                      <b>{term}:</b> {desc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Transition Callout: "The partner you call" */}
        <div className="wrap center partner" data-reveal>
          <h2 className="big" data-text-reveal>The partner you call</h2>
          <p className="muted">
            We work with businesses and individuals whose daily operation depends on software working properly. We build for the long term.
          </p>
          <Link to="/contact" className="pill light">
            Let’s talk
          </Link>
        </div>
      </section>

      {/* =========================================================================
          4. TEAM & LEADERSHIP: Editorial Governance Presentation
          ========================================================================= */}
      <section className="section sand" id="team" aria-labelledby="team-heading">
        <div className="wrap">
          <div className="editorial-intro editorial-intro--split">
            <div>
              <small className="label" data-reveal>Authorized leadership</small>
              <h2 className="big" id="team-heading" data-text-reveal>
                People behind the practice.
              </h2>
            </div>
            <p className="muted" data-reveal>
              Experienced technical leadership setting the standard for thoughtful engineering, responsible growth, and dependable digital systems.
            </p>
          </div>

          <div className="leadership-editorial" data-reveal-stagger aria-labelledby="team-heading">
            {[COMPANY_INFO.leadership[0], COMPANY_INFO.leadership[1]].map((leader, index) => (
              <article className={`leader-profile ${index === 0 ? 'leader-profile--primary' : ''}`} key={leader.name}>
                <div className="leader-portrait-wrap">
                  <div className="portrait-placeholder" role="img" aria-label={leader.portraitAlt}>
                    {leader.portrait ? (
                      <img src={leader.portrait} alt={leader.portraitAlt} />
                    ) : (
                      <span aria-hidden="true">{leader.initials}</span>
                    )}
                  </div>
                  <span className="portrait-index">0{index + 1}</span>
                </div>
                <div className="leader-copy">
                  <span className="team-badge">{leader.role}</span>
                  <h3>{leader.name}</h3>
                  <p>{leader.bio}</p>
                  <small className="media-status">{leader.portraitStatus}</small>
                  <div className="leader-rule" />
                  <span className="leader-detail">
                    {index === 0 ? 'Strategic direction & governance' : 'Architecture & technology standards'}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="reviews" aria-labelledby="reviews-heading">
        <div className="wrap">
          <div className="editorial-intro editorial-intro--split">
            <div>
              <small className="label" data-reveal>Customer Testimonials</small>
              <h2 className="big" id="reviews-heading" data-text-reveal>Reliability, proven by results.</h2>
            </div>
            <p className="muted" data-reveal>
              We measure our success by the resilience of the systems we build and the satisfaction of the partners who trust us.
            </p>
          </div>

          <div className="reviews-editorial" data-reveal-stagger aria-labelledby="reviews-heading">
            {CUSTOMER_REVIEWS.map((review, index) => (
              <article className="review-card" key={review.id}>
                <div className="review-card-inner">
                  <div className="review-header">
                    <div className="review-user">
                      <div className="review-avatar-premium">
                        {review.avatar ? (
                          <img src={review.avatar} alt={review.avatarAlt} />
                        ) : (
                          <span>{review.avatarLabel}</span>
                        )}
                      </div>
                      <div className="review-info">
                        <h4>{review.label}</h4>
                        <span>{review.role}</span>
                      </div>
                    </div>
                    <div className="review-badge-premium">
                      <ShieldCheck size={16} />
                      <span>{review.status}</span>
                    </div>
                  </div>
                  
                  <div className="review-rating">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="var(--gold)" color="var(--gold)" />
                    ))}
                  </div>

                  <p className="review-body">"{review.quote}"</p>
                  
                  <div className="review-footer-premium">
                    <span className="review-index-premium">Case Study 0{index + 1}</span>
                    <div className="review-line-premium" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. "TELL US WHAT YOU NEED": Interactive Service Grid & Inquiry Form
          ========================================================================= */}
      <section className="section need" id="contact" aria-labelledby="need-heading">
        <div className="wrap">
          <h2 className="big center" id="need-heading" data-text-reveal>
            Tell us what you need.
          </h2>

          {step === 1 && (
            <>
              <div className="ask" data-reveal>
                <span>I need</span>
                <output aria-live="polite">
                  {chosenLabels.length ? chosenLabels.join(', ') : 'choose from the list below'}
                </output>
                <button
                  type="button"
                  className="pill dark"
                  onClick={() => setStep(2)}
                >
                  Next
                </button>
              </div>

              <ul className="svc" data-reveal-stagger>
                {SERVICES.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      aria-pressed={selectedServices.includes(s.id)}
                      onClick={() => toggleService(s.id)}
                    >
                      <b>{s.title}</b>
                      <small>{s.shortDesc}</small>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {step === 2 && (
            <form className="form" onSubmit={handleFormSubmit} noValidate>
              <p className="muted" style={{ marginBottom: '1.2rem' }}>
                Services selected: <strong>{chosenLabels.length ? chosenLabels.join(', ') : 'General discussion'}</strong>. Fill out the details below and our team will get back to you promptly.
              </p>

              <div className="hp" aria-hidden="true">
                <label>
                  Leave empty
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={formState.trap}
                    onChange={(e) => setFormState({ ...formState, trap: e.target.value })}
                  />
                </label>
              </div>

              <label>
                Your name
                <input
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  maxLength={80}
                  autoComplete="name"
                  aria-invalid={!!formErrors.name}
                  aria-describedby="err-name"
                />
              </label>
              <p className="err" id="err-name">{formErrors.name}</p>

              <label>
                Email address
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  maxLength={120}
                  autoComplete="email"
                  aria-invalid={!!formErrors.email}
                  aria-describedby="err-email"
                />
              </label>
              <p className="err" id="err-email">{formErrors.email}</p>

              <label>
                Your message
                <textarea
                  value={formState.msg}
                  onChange={(e) => setFormState({ ...formState, msg: e.target.value })}
                  maxLength={1000}
                  aria-invalid={!!formErrors.msg}
                  aria-describedby="err-msg"
                  placeholder="Outline your project scope, requirements or timeline..."
                />
              </label>
              <p className="err" id="err-msg">{formErrors.msg}</p>

              <div className="row">
                <button
                  type="button"
                  className="pill light"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                >
                  Back
                </button>
                <button type="submit" className="pill dark" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send inquiry'}
                </button>
              </div>
              {submitStatus === 'error' && (
                <p className="err" style={{ marginTop: '1rem', textAlign: 'center' }}>
                  Something went wrong. Please try again or contact us directly.
                </p>
              )}
            </form>
          )}

          {step === 3 && (
            <div className="done" role="status">
              <h3>Thank you, {formState.name.trim()}.</h3>
              <p>
                Your inquiry has been received successfully! Our engineering team will review your requirements for {chosenLabels.join(', ')} and reach out to you within 24 hours.
              </p>
              <button
                type="button"
                className="pill dark"
                onClick={() => {
                  setStep(1);
                  setFormState({ name: '', email: '', msg: '', trap: '' });
                  setSelectedServices(['software-dev']);
                }}
              >
                Start again
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
