import { useState, useRef } from 'react';
import { CAREER_OPPORTUNITIES, FAQ_ITEMS } from '../data/companyData';
import { useWeichieScrollAnimations } from '../hooks/useWeichieScrollAnimations';
import { FileText, UploadCloud, X } from 'lucide-react';

export default function CareersPage() {
  const pageRef = useRef(null);
  const cvInputRef = useRef(null);
  useWeichieScrollAnimations(pageRef);

  const [selectedRole, setSelectedRole] = useState(CAREER_OPPORTUNITIES[0].title);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cvError, setCvError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCvFile = (file) => {
    if (!file) return;

    const acceptedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!acceptedTypes.includes(file.type)) {
      setCvFile(null);
      setCvError('Please upload your CV as a PDF, DOC, or DOCX file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setCvFile(null);
      setCvError('Your CV must be smaller than 10 MB.');
      return;
    }

    setCvFile(file);
    setCvError('');
  };

  const handleCvDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleCvFile(e.dataTransfer.files[0]);
  };

  const removeCv = () => {
    setCvFile(null);
    setCvError('');
    if (cvInputRef.current) cvInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !cvFile) {
      if (!cvFile) setCvError('Please attach your CV before submitting.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div ref={pageRef} style={{ paddingTop: '5.5rem' }}>
      <section className="section">
        <div className="wrap">
          <small className="label" data-reveal>Internship & Talent Incubation</small>
          <h1 className="big" style={{ marginBottom: '1.2rem' }} data-text-reveal>
            Careers & internships
          </h1>
          <p className="lead" style={{ margin: '0 0 2rem 0', maxWidth: '64ch' }} data-reveal>
            We work with undergraduates and developers eager to build production software. Weekly project sprints, one-on-one code reviews, and structured mentorship.
          </p>

          <ul className="chips" data-reveal-stagger>
            <li>Software engineering</li>
            <li>UI/UX design</li>
            <li>Testing and QA</li>
            <li>Cloud and DevOps</li>
            <li>AI and data</li>
          </ul>
        </div>
      </section>

      {/* Open Tracks */}
      <section className="section sand">
        <div className="wrap">
          <small className="label" data-reveal>Open Opportunities</small>
          <h2 data-text-reveal>Internship tracks</h2>
          <p className="muted" style={{ marginBottom: '3rem' }} data-reveal>
            Candidates are evaluated on independence, technical soundness, and ability to explain architectural decisions.
          </p>

          <div data-reveal-stagger style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            {CAREER_OPPORTUNITIES.map((role) => (
              <div key={role.id} className="service-editorial-card">
                <span className="pill terracotta-tag" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                  {role.department}
                </span>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>{role.title}</h3>
                <p style={{ color: 'var(--subtle)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {role.location} • {role.type}
                </p>
                <p style={{ fontSize: '0.94rem', color: 'var(--muted)', marginBottom: '1.2rem' }}>
                  {role.description}
                </p>

                <ul className="dots" style={{ marginBottom: '1.5rem' }}>
                  {role.requirements.slice(0, 2).map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="pill light"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                  onClick={() => {
                    setSelectedRole(role.title);
                    document.getElementById('career-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Apply for this track
                </button>
              </div>
            ))}
          </div>

          {/* Application Form */}
          <div id="career-form" className="form" data-reveal style={{ marginTop: '3rem' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Submit your application</h3>
            <p className="muted" style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Selected applicants will be contacted directly by our talent engineering team for an interview.
            </p>

            {submitted ? (
              <div className="done" style={{ border: 'none', padding: 0 }}>
                <h3>Application logged.</h3>
                <p>
                  Thank you, {name}. Your application for {selectedRole} has been submitted successfully. We will review your profile and get in touch.
                </p>
                <button
                  type="button"
                  className="pill dark"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setNote('');
                    removeCv();
                  }}
                >
                  Submit another application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label>
                  Applying role
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    style={{
                      width: '100%',
                      marginTop: '0.4rem',
                      padding: '0.85rem 1.1rem',
                      border: '1px solid var(--line)',
                      borderRadius: '12px',
                      background: 'var(--paper)',
                      color: 'var(--ink)'
                    }}
                  >
                    {CAREER_OPPORTUNITIES.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Your name *
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kasun Fernando"
                  />
                </label>

                <label>
                  Email address *
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. candidate@university.lk"
                  />
                </label>

                <label>
                  Why Yakunex Technologies?
                  <textarea
                    rows="3"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Tell us about your coding projects, coursework or technical passions..."
                  />
                </label>

                <div className="cv-upload-field">
                  <span className="cv-upload-label">CV / resume *</span>
                  <input
                    ref={cvInputRef}
                    className="cv-upload-input"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => handleCvFile(e.target.files[0])}
                  />
                  {cvFile ? (
                    <div className="cv-file-selected">
                      <FileText size={20} aria-hidden="true" />
                      <span title={cvFile.name}>{cvFile.name}</span>
                      <button type="button" onClick={removeCv} aria-label="Remove CV">
                        <X size={18} aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={`cv-dropzone${isDragging ? ' is-dragging' : ''}`}
                      onClick={() => cvInputRef.current?.click()}
                      onDragEnter={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDragLeave={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false);
                      }}
                      onDrop={handleCvDrop}
                    >
                      <UploadCloud size={24} aria-hidden="true" />
                      <span>Drag and drop your CV here, or <strong>browse</strong></span>
                      <small>PDF, DOC, or DOCX up to 10 MB</small>
                    </button>
                  )}
                  {cvError && <p className="cv-upload-error" role="alert">{cvError}</p>}
                </div>

                <div style={{ marginTop: '1.8rem', textAlign: 'right' }}>
                  <button type="submit" className="pill dark">
                    Submit application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="wrap">
          <small className="label" data-reveal>Questions & Answers</small>
          <h2 data-text-reveal>Internship FAQ</h2>

          <div data-reveal-stagger style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            {FAQ_ITEMS.map((faq, i) => (
              <div key={i} className="editorial-card">
                <h3>{faq.question}</h3>
                <p style={{ marginTop: '0.8rem', fontSize: '0.95rem' }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
