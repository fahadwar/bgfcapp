export default function AdminModal({ title, description, open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 py-8">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-bgfc-gold/70">{title}</p>
            {description && <p className="mt-2 text-sm text-white/60">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/60 transition hover:text-white"
          >
            Close
          </button>
        </div>
        <div className="mt-6 space-y-4 overflow-y-auto pr-1" style={{ maxHeight: '65vh' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
