export default function SectionHeader({
  badge,
  title,
  gradientWord,
  subtitle,
  align = 'center'
}) {
  return (
    <div className={`section-header ${align === 'left' ? 'text-left' : ''}`}>
      {badge && <span className="badge-tag">{badge}</span>}
      <h2 className="section-title">
        {title}{' '}
        {gradientWord && <span className="text-gradient">{gradientWord}</span>}
      </h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}
