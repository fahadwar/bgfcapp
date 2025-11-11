const quickLinks = [
  { id: 'facebook', label: 'Facebook', href: 'https://facebook.com/bgfcgoldenlions' },
  { id: 'x', label: 'X (Twitter)', href: 'https://x.com/bgfcgoldenlions' },
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/bgfcgoldenlions' }
];

export default function QuickLinks() {
  return (
    <div className="card-surface p-6">
      <h3 className="text-lg font-display font-semibold text-white">Quick Links</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {quickLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white/80 transition hover:border-bgfc-gold/60 hover:text-bgfc-gold"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
