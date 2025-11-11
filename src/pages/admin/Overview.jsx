import { useMemo } from 'react';
import { useData } from '../../context/DataContext.jsx';

const statCards = (
  promotionsCount,
  matchesCount,
  newsCount
) => [
  {
    label: 'Active Promotions',
    value: promotionsCount,
    description: 'Carousel items visible on the home hero.',
    accent: 'from-yellow-500/80 to-yellow-600/30'
  },
  {
    label: 'Matches Loaded',
    value: matchesCount,
    description: 'Fixtures powering the schedule and voting.',
    accent: 'from-emerald-500/80 to-emerald-600/30'
  },
  {
    label: 'Published Stories',
    value: newsCount,
    description: 'Articles surfaced across the BGFC app.',
    accent: 'from-sky-500/80 to-sky-600/30'
  }
];

export default function DashboardOverview() {
  const { promotions, matches, news } = useData();

  const cards = useMemo(
    () => statCards(promotions?.length ?? 0, matches?.length ?? 0, news?.length ?? 0),
    [promotions, matches, news]
  );

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-display font-semibold text-white">Operational Snapshot</h2>
        <p className="mt-2 text-sm text-white/60">
          Monitor the health of your Firestore content and jump into each module to make updates in real time.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.label}
              className={`rounded-2xl border border-white/5 bg-gradient-to-br ${card.accent} p-6 shadow-lg backdrop-blur`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">{card.label}</p>
              <p className="mt-3 text-4xl font-display font-semibold text-white">{card.value}</p>
              <p className="mt-3 text-sm text-white/70">{card.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="card-surface border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-display font-semibold text-white">Quick Guidance</h3>
        <ul className="mt-4 space-y-3 text-sm text-white/70">
          <li>• Promotions appear on the home hero carousel and respect the order value you set.</li>
          <li>• Matches feed the schedule grid, ticket purchase buttons, and Man of the Match voting.</li>
          <li>• News posts power the home feed and Fan Zone top stories. Use markdown for rich formatting.</li>
        </ul>
      </section>
    </div>
  );
}
