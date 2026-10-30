import { useState, useEffect, useRef, useMemo } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

import { Search } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { useTheme } from '../../context/ThemeContext';
import GlobalSearch from './GlobalSearch';

/**
 * MagneticNavText — High-Precision Magnetic Font Cursor Effect
 * Each individual character magnetically responds to cursor movement
 * with organic spring physics and spring-back to equilibrium.
 */
function MagneticNavText({ text, active = false }) {
  const containerRef = useRef(null);
  const charRefs = useRef([]);
  const animFrameRef = useRef(null);
  const isLoopRunning = useRef(false);
  const mouseState = useRef({ x: -9999, y: -9999, active: false });
  const physicsData = useRef([]);
  const [canInteract, setCanInteract] = useState(true);

  const chars = useMemo(() => text.split(''), [text]);

  useEffect(() => {
    const isTouch = window.matchMedia && !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) {
      setCanInteract(false);
    }
  }, []);

  useEffect(() => {
    physicsData.current = chars.map(() => ({
      currX: 0,
      currY: 0,
      currRot: 0,
      currScale: 1,
      targetX: 0,
      targetY: 0,
      targetRot: 0,
      targetScale: 1,
      active: false,
    }));
  }, [chars]);

  const updatePhysics = () => {
    let hasMotion = false;
    const { x: mx, y: my, active: mouseActive } = mouseState.current;
    const radius = 65;
    const intensity = 8;
    const SPRING = 0.22;

    for (let i = 0; i < chars.length; i++) {
      const el = charRefs.current[i];
      const data = physicsData.current[i];
      if (!el || !data) continue;

      if (mouseActive) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.hypot(dx, dy);

        if (dist < radius && dist > 0.001) {
          const factor = Math.pow((radius - dist) / radius, 1.4);
          data.targetX = (dx / dist) * factor * intensity;
          data.targetY = (dy / dist) * factor * intensity;
          data.targetRot = (dx / dist) * factor * 10;
          data.targetScale = 1 + factor * 0.08;
          data.active = true;
        } else {
          data.targetX = 0;
          data.targetY = 0;
          data.targetRot = 0;
          data.targetScale = 1;
        }
      } else {
        data.targetX = 0;
        data.targetY = 0;
        data.targetRot = 0;
        data.targetScale = 1;
      }

      data.currX += (data.targetX - data.currX) * SPRING;
      data.currY += (data.targetY - data.currY) * SPRING;
      data.currRot += (data.targetRot - data.currRot) * SPRING;
      data.currScale += (data.targetScale - data.currScale) * SPRING;

      if (
        Math.abs(data.currX) > 0.02 ||
        Math.abs(data.currY) > 0.02 ||
        Math.abs(data.currRot) > 0.04 ||
        Math.abs(data.currScale - 1) > 0.003
      ) {
        el.style.transform = `translate3d(${data.currX.toFixed(2)}px, ${data.currY.toFixed(2)}px, 0) rotate(${data.currRot.toFixed(2)}deg) scale(${data.currScale.toFixed(3)})`;
        hasMotion = true;
      } else if (data.active) {
        el.style.transform = '';
        data.active = false;
      }
    }

    if (hasMotion || mouseActive) {
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    } else {
      isLoopRunning.current = false;
    }
  };

  const handlePointerMove = (e) => {
    if (!canInteract) return;
    mouseState.current.x = e.clientX;
    mouseState.current.y = e.clientY;
    mouseState.current.active = true;
    if (!isLoopRunning.current) {
      isLoopRunning.current = true;
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    }
  };

  const handlePointerLeave = () => {
    mouseState.current.active = false;
    if (!isLoopRunning.current && canInteract) {
      isLoopRunning.current = true;
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    }
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <span
      ref={containerRef}
      className={`magnetic-nav-text ${active ? 'active-magnetic-text' : ''}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {chars.map((char, idx) => (
        <span
          key={idx}
          ref={(el) => (charRefs.current[idx] = el)}
          className="nav-magnetic-char"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

/**
 * MagneticEffect — A general-purpose magnetic wrapper for buttons and icons.
 * Provides organic, physics-based response to nearby cursor movement.
 */
function MagneticEffect({ children, intensity = 15, radius = 80 }) {
  const ref = useRef(null);
  const mouseState = useRef({ x: 0, y: 0, active: false });
  const physics = useRef({ currX: 0, currY: 0, targetX: 0, targetY: 0 });
  const animFrame = useRef(null);

  const update = () => {
    const { x, y, active } = mouseState.current;
    const el = ref.current;
    if (!el) return;

    if (active) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < radius) {
        const factor = Math.pow((radius - dist) / radius, 1.2);
        physics.current.targetX = (dx / dist) * factor * intensity;
        physics.current.targetY = (dy / dist) * factor * intensity;
      } else {
        physics.current.targetX = 0;
        physics.current.targetY = 0;
      }
    } else {
      physics.current.targetX = 0;
      physics.current.targetY = 0;
    }

    physics.current.currX += (physics.current.targetX - physics.current.currX) * 0.15;
    physics.current.currY += (physics.current.targetY - physics.current.currY) * 0.15;

    el.style.transform = `translate3d(${physics.current.currX.toFixed(2)}px, ${physics.current.currY.toFixed(2)}px, 0)`;

    animFrame.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    animFrame.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animFrame.current);
  }, []);

  return (
    <div
      ref={ref}
      style={{ display: 'inline-block', transition: 'transform 0.1s ease-out' }}
      onPointerMove={(e) => {
        mouseState.current = { x: e.clientX, y: e.clientY, active: true };
      }}
      onPointerLeave={() => {
        mouseState.current.active = false;
      }}
    >
      {children}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  // Global search keyboard shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Navigation Links including explicit Home button
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Careers', path: '/careers' }
  ];

  return (
    <>
      <header className={`nav-wrap weichie-nav ${scrolled ? 'scrolled' : ''}`}>
        {/* Brand Logo & Name with Magnetic Font Cursor Effect */}
        <Link to="/" className="brand-link" aria-label="Yakunex Home">
          <img src={logoImg} alt="Yakunex Logo" className="brand-logo-img" />
          <span className="brand-title">
            <MagneticNavText text="Yakunex" />
          </span>
        </Link>

        {/* Center Desktop Navigation Links with Magnetic Font Cursor Effect */}
        <nav aria-label="Main Navigation" className="desktop-nav-menu">
          <ul className="nav-links-list">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <MagneticNavText text={link.name} active={location.pathname === link.path} />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Action Suite: Get In Touch + Dark Mode Toggle + EN Pill */}
        <div className="nav-right-actions">
          {/* Global Search Trigger */}
          <MagneticEffect intensity={12} radius={70}>
            <button
              type="button"
              className="search-trigger-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search size={16} />
              <span className="search-trigger-label">Search</span>
              <kbd className="search-trigger-kbd">Ctrl K</kbd>
            </button>
          </MagneticEffect>

          {/* Weichie-style "Get in touch" CTA with Electric Gold Circular Hand Badge */}
          <MagneticEffect intensity={15} radius={80}>
            <Link to="/contact" className="weichie-cta-btn" aria-label="Contact">
              <span className="weichie-cta-text">Contact</span>
              <span className="weichie-cta-icon-badge" aria-hidden="true">
                {/* Clean vector peace / hand outline icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                  <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
                  <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                  <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                </svg>
              </span>
            </Link>
          </MagneticEffect>

          {/* Dark Mode Toggle Button */}
          <MagneticEffect intensity={10} radius={60}>
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              type="button"
            >
            {theme === 'dark' ? (
              /* Moon Icon in Dark Mode */
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="theme-icon moon-icon"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              /* Sun Icon in Light Mode */
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="theme-icon sun-icon"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
        </MagneticEffect>

        {/* Mobile Hamburger Toggle */}
          <button
            className="burger-btn"
            aria-expanded={open}
            aria-label="Toggle navigation menu"
            onClick={() => setOpen(!open)}
            type="button"
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Drawer */}
      <div className={`mobile-nav-fullscreen ${open ? 'open' : ''}`}>
        <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={logoImg}
                alt="Yakunex"
                style={{
                  width: '38px',
                  height: '38px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.18))'
                }}
              />
              <span style={{ fontSize: '1.4rem', fontWeight: 300, color: 'var(--ink)' }}>Yakunex</span>
            </div>

            {/* Dark mode button in mobile drawer */}
            <button
              className="theme-toggle-btn mobile-drawer-theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              type="button"
            >
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>
          </div>

          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2.5rem' }}>
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setOpen(false)}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/contact" onClick={() => setOpen(false)}>
                Contact
              </NavLink>
            </li>
          </ul>

          <Link
            to="/contact"
            className="weichie-cta-btn"
            style={{ width: '100%', justifyContent: 'space-between', padding: '0.65rem 0.75rem 0.65rem 1.4rem' }}
            onClick={() => setOpen(false)}
          >
            <span style={{ fontSize: '1rem', fontWeight: 500 }}>Contact</span>
            <span className="weichie-cta-icon-badge" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1">
                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
                <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      {/* Global Search Command Palette */}
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
