import { SERVICES, PORTFOLIO_PROJECTS } from './companyData';

const STATIC_PAGES = [
  { path: '/', label: 'Home', keywords: ['home', 'main', 'hero', 'landing'] },
  { path: '/services', label: 'Services', keywords: ['services', 'solutions', 'capabilities'] },
  { path: '/portfolio', label: 'Portfolio', keywords: ['portfolio', 'projects', 'work', 'case studies'] },
  { path: '/about', label: 'About', keywords: ['about', 'company', 'team', 'vision', 'mission'] },
  { path: '/careers', label: 'Careers', keywords: ['careers', 'jobs', 'hiring', 'vacancies'] },
  { path: '/contact', label: 'Contact', keywords: ['contact', 'email', 'phone', 'location', 'map'] }
];

/**
 * Build a flat search index from static pages,
 * services, and portfolio projects.
 */
export function buildSearchIndex() {
  const items = [];

  STATIC_PAGES.forEach((page) => {
    items.push({
      id: `page${page.path}`,
      type: 'page',
      title: page.label,
      subtitle: '',
      path: page.path,
      keywords: page.keywords.join(' ')
    });
  });

  SERVICES.forEach((service) => {
    items.push({
      id: `service-${service.id}`,
      type: 'service',
      title: service.title,
      subtitle: service.shortDesc,
      path: `/services?category=${encodeURIComponent(service.category)}`,
      keywords: [service.category, service.searchKeywords || '', ...service.subServices].join(' ')
    });
  });

  PORTFOLIO_PROJECTS.forEach((project) => {
    items.push({
      id: `project-${project.id}`,
      type: 'project',
      title: project.title,
      subtitle: project.disclaimer || project.description,
      path: '/portfolio',
      keywords: [project.category, ...(project.techStack || []), ...(project.highlights || [])].join(' ')
    });
  });

  return items;
}

/**
 * Weighted substring search. Every whitespace-separated term must match
 * somewhere; matches in the title score highest, then subtitle, then keywords.
 */
export function searchItems(items, query, limit = 8) {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const terms = q.split(/\s+/);

  return items
    .map((item) => {
      const title = item.title.toLowerCase();
      const subtitle = (item.subtitle || '').toLowerCase();
      const keywords = (item.keywords || '').toLowerCase();
      const haystack = `${title} ${subtitle} ${keywords}`;

      let score = 0;
      for (const term of terms) {
        if (!haystack.includes(term)) return null;
        if (title.includes(term)) score += 10;
        else if (subtitle.includes(term)) score += 4;
        else score += 1;
      }
      return { item, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}
