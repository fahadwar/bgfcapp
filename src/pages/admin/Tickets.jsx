import { useEffect, useState } from 'react';
import { useAdmin } from '../../context/AdminContext.jsx';
import { useData } from '../../context/DataContext.jsx';

const ticketOrder = ['manage', 'single', 'group', 'season', 'contact'];
const defaultLabels = {
  manage: 'Manage My Tickets',
  single: 'Single Game Tickets',
  group: 'Group Tickets',
  season: 'Season Tickets',
  contact: 'Contact Ticket Office'
};

export default function TicketsManager() {
  const { ticketLinks } = useData();
  const { updateTicketLink } = useAdmin();
  const [drafts, setDrafts] = useState(() => {
    const initial = {};
    ticketOrder.forEach((key) => {
      initial[key] = {
        label: ticketLinks?.[key]?.label ?? defaultLabels[key],
        url: ticketLinks?.[key]?.url ?? ''
      };
    });
    return initial;
  });

  useEffect(() => {
    const nextState = {};
    ticketOrder.forEach((key) => {
      nextState[key] = {
        label: ticketLinks?.[key]?.label ?? defaultLabels[key],
        url: ticketLinks?.[key]?.url ?? ''
      };
    });
    setDrafts(nextState);
  }, [ticketLinks]);

  const handleChange = (id, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (event, id) => {
    event.preventDefault();
    await updateTicketLink(id, drafts[id]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold text-white">Ticketing Links</h2>
        <p className="mt-2 text-sm text-white/60">
          Update the destinations for the vertical ticket menu. These are shared across the entire BGFC experience.
        </p>
      </div>
      <div className="space-y-4">
        {ticketOrder.map((id) => (
          <form
            key={id}
            onSubmit={(event) => handleSubmit(event, id)}
            className="rounded-2xl border border-white/10 bg-black/30 p-5"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-1 space-y-2">
                <label className="text-xs uppercase tracking-[0.35em] text-white/50">Label</label>
                <input
                  value={drafts[id]?.label ?? ''}
                  onChange={(event) => handleChange(id, 'label', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
                  required
                />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-xs uppercase tracking-[0.35em] text-white/50">URL</label>
                <input
                  value={drafts[id]?.url ?? ''}
                  onChange={(event) => handleChange(id, 'url', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-bgfc-gold px-4 py-2 text-sm font-semibold text-bgfc-charcoal shadow-lg transition hover:bg-bgfc-gold/80"
              >
                Save
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
