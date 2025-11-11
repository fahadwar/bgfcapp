import { buildGoogleCalendarLink, downloadIcsFile } from '../utils/calendar.js';

function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export default function ScheduleGrid({ matches }) {
  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div id={match.id} key={match.id} className="card-surface flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-bgfc-gold/10"></div>
              <div>
                <p className="text-xs uppercase tracking-widest text-bgfc-gold">{match.competition}</p>
                <h3 className="text-xl font-display font-semibold text-white">BGFC vs {match.opponent}</h3>
                <p className="text-sm text-white/70">{formatDate(match.date)}</p>
                <p className="text-sm text-white/50">{match.venue}</p>
                {match.status === 'final' && match.score && (
                  <p className="mt-1 text-sm font-semibold text-bgfc-gold">Final: {match.score}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wider text-white/60">
              <span className="rounded-full bg-white/10 px-3 py-1">{match.broadcast}</span>
              <span className="rounded-full bg-white/10 px-3 py-1">{match.status === 'final' ? 'Final' : 'Upcoming'}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:w-64">
            {match.status !== 'final' && (
              <a href={match.ticketsUrl} target="_blank" rel="noreferrer" className="btn-primary w-full">
                Get Tickets
              </a>
            )}
            <a
              href={buildGoogleCalendarLink({
                title: `BGFC vs ${match.opponent}`,
                details: `USL Championship fixture at ${match.venue}`,
                location: match.venue,
                start: match.date,
                end: new Date(new Date(match.date).getTime() + 2 * 60 * 60 * 1000).toISOString()
              })}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary w-full"
            >
              Add to Google Calendar
            </a>
            <button
              type="button"
              onClick={() =>
                downloadIcsFile({
                  title: `BGFC vs ${match.opponent}`,
                  description: `Golden Lions vs ${match.opponent}`,
                  location: match.venue,
                  start: match.date,
                  end: new Date(new Date(match.date).getTime() + 2 * 60 * 60 * 1000).toISOString()
                })
              }
              className="btn-secondary w-full"
            >
              Download .ics
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
