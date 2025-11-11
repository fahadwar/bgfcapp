import TicketMenu from '../components/TicketMenu.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { useData } from '../context/DataContext.jsx';

export default function Tickets() {
  const { ticketLinks } = useData();

  return (
    <div className="space-y-6 pb-10">
      <SectionHeader title="Tickets" eyebrow="Match Access" />
      <TicketMenu links={ticketLinks} />
      <div className="card-surface p-6">
        <h3 className="text-lg font-display font-semibold text-white">Need help?</h3>
        <p className="mt-2 text-sm text-white/70">
          Email <a className="text-bgfc-gold" href="mailto:tickets@bgfc.app">tickets@bgfc.app</a> or call (270) 555-2025 for personalized support.
        </p>
      </div>
    </div>
  );
}
