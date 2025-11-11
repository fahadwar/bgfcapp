import FanZoneCards from '../components/FanZoneCards.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import NewsGrid from '../components/NewsGrid.jsx';
import QuickLinks from '../components/QuickLinks.jsx';
import AlertSignup from '../components/AlertSignup.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { useData } from '../context/DataContext.jsx';

export default function FanZone() {
  const { fanZoneSections, news, loading } = useData();
  const featuredStories = news.slice(0, 3);

  return (
    <div className="space-y-8 pb-10">
      <section>
        <SectionHeader title="Fan Zone" eyebrow="Golden Lion Community" />
        <FanZoneCards sections={fanZoneSections} />
      </section>
      <section>
        <SectionHeader title="Top Stories" eyebrow="Featured" />
        {loading ? <LoadingState label="Loading stories" /> : <NewsGrid articles={featuredStories} />}
      </section>
      <QuickLinks />
      <AlertSignup />
    </div>
  );
}
