import { Link } from 'react-router-dom';
import { buildGoogleCalendarLink } from '../utils/calendar.js';

function formatDate(date) {
  return new Date(date).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export default function MatchList({ matches, variant = 'upcoming', showCTA = true }) {
  const filtered = matches
    .filter((match) => (variant === 'upcoming' ? match.status !== 'final' : match.status === 'final'))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="space-y-4">
      {filtered.map((match) => (
        <div key={match.id} className="card-surface flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-4">
            <div className="h-14 w-14 flex-shrink-0 rounded-full bg-bgfc-gold/10"></div>
            <div>
              <p className="text-xs uppercase tracking-widest text-bgfc-gold">{match.competition}</p>
              <p className="text-lg font-display font-semibold text-white">BGFC vs {match.opponent}</p>
              <p className="text-sm text-white/70">
                {formatDate(match.date)} · {match.venue}
              </p>
              {match.status === 'final' && (match.scoreDisplay || match.score) && (
                <p className="mt-1 text-sm font-semibold text-bgfc-gold">
                  Final Score:{' '}
                  {typeof match.score === 'object' && match.score !== null
                    ? `${match.score.bgfc ?? 0}-${match.score.opp ?? 0}`
                    : match.scoreDisplay ?? match.score}
                </p>
              )}
            </div>
          </div>
          {showCTA && (
            <div className="flex flex-col gap-2 md:w-56">
              {match.status !== 'final' ? (
                <a href={match.ticketsUrl ?? match.ticketUrl} target="_blank" rel="noreferrer" className="btn-primary w-full">
                  Buy Tickets
                </a>
              ) : (
                <Link to={`/schedule#${match.id}`} className="btn-secondary w-full">
                  Match Center
                </Link>
              )}
              <a
                href={buildGoogleCalendarLink({
                  title: `BGFC vs ${match.opponent}`,
                  details: `Catch the Golden Lions vs ${match.opponent}`,
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
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
