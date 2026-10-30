import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, CornerDownLeft, FileText, Layers, FolderKanban } from 'lucide-react';
import { buildSearchIndex, searchItems } from '../../data/searchIndex';

const TYPE_ICON = {
  page: FileText,
  service: Layers,
  project: FolderKanban
};

export default function GlobalSearch({ open, onOpenChange }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const index = useMemo(() => buildSearchIndex(), []);
  const results = useMemo(() => searchItems(index, query), [index, query]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIndex(0);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onOpenChange(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter' && results[activeIndex]) {
        e.preventDefault();
        navigate(results[activeIndex].path);
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, activeIndex, navigate, onOpenChange]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const go = (path) => {
    navigate(path);
    onOpenChange(false);
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    // Escape special regex characters to prevent crash
    const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <strong key={i} style={{ color: 'var(--brand-gold-text)', fontWeight: 700 }}>{part}</strong>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="search-palette-overlay" onClick={() => onOpenChange(false)}>
      <div
        className="search-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Global Search"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="search-palette-field">
          <Search size={18} color="var(--subtle)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search services, projects, or pages..."
            aria-label="Search"
          />
          <button
            type="button"
            className="search-palette-close"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {query.trim() && (
          <div className="search-palette-results" role="listbox">
            {results.length === 0 ? (
              <div className="search-palette-empty">
                <p>No results found</p>
                <span>Try a different keyword like React, Cloud, POS, or AI.</span>
                <div style={{ marginTop: '1.5rem' }}>
                  <button
                    onClick={() => go('/contact')}
                    className="pill dark"
                    style={{ fontSize: '0.8rem', padding: '0.5rem 1.2rem' }}
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            ) : (
              results.map((item, idx) => {
                const Icon = TYPE_ICON[item.type] || FileText;
                const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={idx === activeIndex}
                    className={`search-result-item ${idx === activeIndex ? 'active' : ''}`}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => go(item.path)}
                  >
                    <span className="search-result-icon">
                      <Icon size={16} />
                    </span>
                    <span className="search-result-body">
                      <span className="search-result-title">{highlightText(item.title, query)}</span>
                      {item.subtitle && (
                        <span className="search-result-subtitle">{highlightText(item.subtitle, query)}</span>
                      )}
                    </span>
                    <span className="search-result-type">{typeLabel}</span>
                    <CornerDownLeft size={14} className="search-result-enter" />
                  </button>
                );
              })
            )}
          </div>
        )}

        {!query.trim() && (
          <div className="search-palette-hint">
            <span>Try: React, Cloud, POS, AI, SEO</span>
            <span>Try: portfolio, ERP, e-commerce</span>
          </div>
        )}

        <div className="search-palette-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
          <span><kbd>Enter</kbd> to open</span>
          <span><kbd>Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
