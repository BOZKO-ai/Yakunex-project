import { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { COMPANY_INFO, SERVICES } from '../data/companyData';
import LocationMap from '../components/common/LocationMap';
import { useWeichieScrollAnimations } from '../hooks/useWeichieScrollAnimations';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  const pageRef = useRef(null);
  useWeichieScrollAnimations(pageRef);

  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service');
  const prefilledProject = searchParams.get('project') || '';

  const [selectedServices, setSelectedServices] = useState(() => {
    return preselectedService ? [preselectedService] : ['software-dev'];
  });

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: prefilledProject ? `Inquiry regarding: ${prefilledProject}` : '',
    trap: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const chosenLabels = SERVICES.filter((s) => selectedServices.includes(s.id)).map((s) => s.title);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.trap) return;
    const errs = {};
    if (!form.name.trim()) errs.name = 'Please enter your name.';
    if (!EMAIL_REGEX.test(form.email.trim())) errs.email = 'Please enter a valid email address.';
    if (form.message.trim().length < 8) errs.message = 'Please provide details about your inquiry.';

    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitted(true);
  };

  return (
    <div ref={pageRef} style={{ paddingTop: '5.5rem' }}>
      <section className="section">
        <div className="wrap">
          <small className="label" data-reveal>Contact & Inquiries</small>
          <h1 className="big" style={{ marginBottom: '1.2rem' }} data-text-reveal>
            Tell us what you need.
          </h1>
          <p className="lead" style={{ margin: '0 0 3.5rem 0', maxWidth: '64ch' }} data-reveal>
            We work with businesses and individuals whose operations depend on software functioning reliably. Send us your requirements to start the conversation.
          </p>

          <div className="split">
            {/* Left Column: Office Details & Quick Links */}
            <div>
              <div className="office" style={{ maxWidth: '100%', marginBottom: '1.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                  <h3 style={{ margin: 0 }}>Corporate Office</h3>
                  <a
                    href="#map"
                    className="pill terracotta-tag"
                    style={{ fontSize: '0.74rem', padding: '0.24rem 0.75rem', gap: '5px' }}
                  >
                    View Map ↓
                  </a>
                </div>
                <p>{COMPANY_INFO.address.full}</p>
                <small style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.8rem' }}>
                  <span>
                    Email:{' '}
                    <a href={`mailto:${COMPANY_INFO.contacts.email}`} style={{ color: 'var(--ink)', textDecoration: 'underline' }}>
                      {COMPANY_INFO.contacts.email}
                    </a>
                  </span>
                  <span>
                    Direct:{' '}
                    <a href={`tel:${COMPANY_INFO.contacts.phone.replace(/[^0-9+]/g, '')}`} style={{ color: 'var(--ink)', textDecoration: 'underline' }}>
                      {COMPANY_INFO.contacts.phone}
                    </a>
                  </span>
                  <span>
                    Hotline:{' '}
                    <a href={`tel:${COMPANY_INFO.contacts.hotline.replace(/[^0-9+]/g, '')}`} style={{ color: 'var(--ink)', textDecoration: 'underline' }}>
                      {COMPANY_INFO.contacts.hotline}
                    </a>
                  </span>
                  <span>Hours: {COMPANY_INFO.contacts.workingHours}</span>
                </small>
              </div>

              <div className="editorial-card" style={{ padding: '1.8rem', background: 'var(--sand)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)' }}>
                <span className="pill terracotta-tag" style={{ marginBottom: '0.8rem', display: 'inline-block' }}>
                  Direct Response Guarantee
                </span>
                <p style={{ fontSize: '0.92rem', color: 'var(--muted)', lineHeight: '1.6', margin: 0 }}>
                  We prioritize all client consultations and project inquiries. Our engineering and technical solutions team reviews each request carefully and responds within one business day.
                </p>
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <div>
              {submitted ? (
                <div className="done">
                  <h3>Thank you, {form.name.trim()}.</h3>
                  <p>
                    Your inquiry has been submitted successfully! Our engineering team will review your requirements and reach out to you within 24 hours. <br />
                    <strong>Requested Domains:</strong> {chosenLabels.join(', ')}
                  </p>
                  <div
                    style={{
                      background: 'var(--sand)',
                      padding: '1.2rem',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      color: 'var(--muted)',
                      marginBottom: '1.5rem',
                      fontFamily: 'monospace'
                    }}
                  >
                    <div>Sender: {form.name} ({form.email})</div>
                    {form.phone && <div>Contact: {form.phone}</div>}
                    <div>Organization: {form.company || 'Not Specified'}</div>
                    <div>Message: {form.message}</div>
                  </div>
                  <button
                    type="button"
                    className="pill dark"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', phone: '', company: '', message: '', trap: '' });
                      setSelectedServices(['software-dev']);
                    }}
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form className="form" onSubmit={handleSubmit} noValidate style={{ maxWidth: '100%' }}>
                  {/* Service selector chips */}
                  <label style={{ marginTop: 0 }}>
                    Select services of interest ({selectedServices.length} selected)
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '0.8rem 0 1.5rem 0' }}>
                    {SERVICES.map((s) => {
                      const isSelected = selectedServices.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleService(s.id)}
                          style={{
                            background: isSelected ? 'var(--brand-gold)' : 'var(--paper)',
                            color: isSelected ? '#0B0D10' : 'var(--ink)',
                            border: `1px solid ${isSelected ? 'var(--brand-gold)' : 'var(--line)'}`,
                            borderRadius: '999px',
                            padding: '0.35rem 0.85rem',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            fontWeight: isSelected ? 600 : 400,
                            boxShadow: isSelected ? '0 2px 8px rgba(255, 201, 40, 0.25)' : 'none',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {isSelected ? `✓ ${s.title}` : `+ ${s.title}`}
                        </button>
                      );
                    })}
                  </div>

                  <div className="hp" aria-hidden="true">
                    <label>
                      Leave empty
                      <input
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.trap}
                        onChange={(e) => setForm({ ...form, trap: e.target.value })}
                      />
                    </label>
                  </div>

                  <label>
                    Your name *
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      maxLength={80}
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                      placeholder="e.g. Kasun Fernando"
                    />
                  </label>
                  <p className="err">{errors.name}</p>

                  <label>
                    Email address *
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      maxLength={120}
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      placeholder="name@company.com"
                    />
                  </label>
                  <p className="err">{errors.email}</p>

                  <label>
                    Phone / WhatsApp Number (Optional)
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      maxLength={25}
                      autoComplete="tel"
                      placeholder="+94 77 123 4567"
                    />
                  </label>

                  <label style={{ marginTop: '1.2rem' }}>
                    Company or Organization
                    <input
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      maxLength={100}
                      placeholder="e.g. Nexus Innovations"
                    />
                  </label>

                  <label>
                    Your message *
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      maxLength={1000}
                      aria-invalid={!!errors.message}
                      placeholder="Tell us about your project timeline, requirements or technical inquiries..."
                    />
                  </label>
                  <p className="err">{errors.message}</p>

                  <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                    <button type="submit" className="pill dark">
                      Send inquiry
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Section Anchor and Dedicated Location Map Component */}
          <div id="map" style={{ marginTop: '5rem', scrollMarginTop: '120px' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <small className="label">Physical Presence & Navigation</small>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', margin: 0 }}>
                Find us on the map
              </h2>
            </div>
            <LocationMap />
          </div>
        </div>
      </section>
    </div>
  );
}
