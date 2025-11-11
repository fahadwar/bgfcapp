import SectionHeader from '../components/SectionHeader.jsx';
import ScheduleGrid from '../components/ScheduleGrid.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { useData } from '../context/DataContext.jsx';

export default function Schedule() {
  const { matches, loading } = useData();

  const sortedMatches = [...matches].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="space-y-8 pb-10">
      <SectionHeader title="Season Schedule" eyebrow="2025 Campaign" />
      {loading ? <LoadingState label="Loading schedule" /> : <ScheduleGrid matches={sortedMatches} />}
    </div>
  );
}
