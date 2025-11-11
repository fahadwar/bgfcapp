export default function LoadingState({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex items-center gap-3 text-white/60">
        <svg className="h-6 w-6 animate-spin text-bgfc-gold" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
        </svg>
        <span className="text-sm uppercase tracking-widest">{label}</span>
      </div>
    </div>
  );
}
