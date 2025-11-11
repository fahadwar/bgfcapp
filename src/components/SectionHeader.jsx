export default function SectionHeader({ title, eyebrow, action }) {
  return (
    <div className="mb-4 flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
      <div>
        {eyebrow && <p className="text-xs uppercase tracking-widest text-bgfc-gold">{eyebrow}</p>}
        <h2 className="text-2xl font-display font-semibold text-white">{title}</h2>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
