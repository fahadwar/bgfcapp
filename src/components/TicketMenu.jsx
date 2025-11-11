import { ArrowRightIcon } from '@heroicons/react/24/outline';

const ticketSections = [
  { id: 'manage', label: 'Manage My Tickets', description: 'Access and transfer your season or single-game tickets.' },
  { id: 'single', label: 'Single Game Tickets', description: 'Secure your seat for the next Golden Lions home match.' },
  { id: 'group', label: 'Group Tickets', description: 'Bring the whole crew and unlock special pricing.' },
  { id: 'season', label: 'Season Tickets', description: 'Join the Pride for every home match in 2025.' },
  { id: 'contact', label: 'Contact Ticket Office', description: 'Chat with our ticket experts for custom experiences.' }
];

export default function TicketMenu({ links }) {
  return (
    <div className="space-y-3">
      {ticketSections.map((section) => (
        <a
          key={section.id}
          href={links[section.id]}
          target="_blank"
          rel="noreferrer"
          className="card-surface flex items-center justify-between gap-4 p-5 transition hover:border-bgfc-gold/40"
        >
          <div>
            <h3 className="text-lg font-display font-semibold text-white">{section.label}</h3>
            <p className="text-sm text-white/70">{section.description}</p>
          </div>
          <ArrowRightIcon className="h-6 w-6 text-bgfc-gold" />
        </a>
      ))}
    </div>
  );
}
