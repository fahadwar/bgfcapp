import HeroCarousel from '../components/HeroCarousel.jsx';
import MatchList from '../components/MatchList.jsx';
import VotingPanel from '../components/VotingPanel.jsx';
import NewsGrid from '../components/NewsGrid.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { useData } from '../context/DataContext.jsx';

export default function Home() {
  const { matches, news, loading } = useData();

  const upcomingMatches = matches.filter((match) => match.status !== 'final').slice(0, 3);
  const recentMatches = matches.filter((match) => match.status === 'final').slice(0, 3);

  return (
    <div className="space-y-10 pb-6">
      <HeroCarousel />
      <section>
        <SectionHeader title="Upcoming Matches" eyebrow="Matchday" />
        {loading ? <LoadingState label="Loading schedule" /> : <MatchList matches={upcomingMatches} />}
      </section>
      <section className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div>
          <SectionHeader title="Recent Results" eyebrow="Recap" />
          {loading ? <LoadingState label="Loading results" /> : <MatchList matches={recentMatches} variant="results" showCTA={false} />}
        </div>
        <VotingPanel />
      </section>
      <section>
        <SectionHeader title="Club News" eyebrow="Golden Lion Stories" />
        {loading ? <LoadingState label="Loading news" /> : <NewsGrid articles={news} />}
      </section>
    </div>
  );
}
