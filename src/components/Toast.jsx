import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useUI } from '../context/UIContext.jsx';

const variantStyles = {
  success: 'bg-emerald-600/80 text-white',
  error: 'bg-red-600/80 text-white',
  warning: 'bg-amber-500/80 text-black',
  info: 'bg-bgfc-gold/80 text-black'
};

export default function Toast() {
  const { toast, hideToast } = useUI();

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        hideToast();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hideToast]);

  if (!toast) return null;

  const style = variantStyles[toast.variant] ?? variantStyles.success;

  return (
    <div className="fixed inset-x-0 bottom-6 z-[100] flex justify-center px-4 sm:justify-end sm:px-8">
      <div className={`flex w-full max-w-sm items-start gap-3 rounded-2xl px-4 py-3 shadow-xl backdrop-blur ${style}`}>
        <div className="flex-1 text-sm font-medium leading-5">{toast.message}</div>
        <button
          type="button"
          onClick={hideToast}
          className="rounded-full bg-black/10 p-1 text-current transition hover:bg-black/20"
        >
          <XMarkIcon className="h-4 w-4" />
          <span className="sr-only">Dismiss notification</span>
        </button>
      </div>
    </div>
  );
}
