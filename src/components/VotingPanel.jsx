import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';

export default function VotingPanel() {
  const { user } = useAuth();
  const { motm, voteForPlayer } = useData();
  const [status, setStatus] = useState(null);
  const totalVotes = (motm.players ?? []).reduce((sum, player) => sum + player.votes, 0) || 1;

  const handleVote = async (playerId) => {
    if (!motm?.activeMatchId) return;
    try {
      const response = await voteForPlayer({
        matchId: motm.activeMatchId,
        playerId,
        uid: user?.uid ?? 'guest-user'
      });
      setStatus(response.alreadyVoted ? 'already' : 'success');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="card-surface space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-bgfc-gold">Matchday Vote</p>
          <h3 className="text-xl font-display font-semibold text-white">Man of the Match</h3>
          <p className="text-sm text-white/60">Vote for your Golden Lion standout.</p>
        </div>
        <span className="rounded-full bg-bgfc-gold/20 px-3 py-1 text-xs font-semibold text-bgfc-gold">
          BGFC vs {motm.opponent ?? 'TBD'}
        </span>
      </div>
      <div className="space-y-3">
        {(motm.players ?? []).map((player) => {
          const percentage = Math.round((player.votes / totalVotes) * 100);
          return (
            <button
              key={player.id}
              type="button"
              onClick={() => handleVote(player.id)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-bgfc-gold/60"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{player.name}</p>
                  <p className="text-xs text-white/60">{player.position}</p>
                </div>
                <span className="text-sm font-semibold text-bgfc-gold">{percentage}%</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <span style={{ width: `${percentage}%` }} className="block h-full rounded-full bg-bgfc-gold" />
              </div>
            </button>
          );
        })}
      </div>
      {status === 'success' && <p className="text-sm text-bgfc-gold">Vote submitted! Thanks for supporting the Pride.</p>}
      {status === 'already' && (
        <p className="text-sm text-white/60">You already voted for this match. Check back next fixture!</p>
      )}
      {status === 'error' && <p className="text-sm text-red-400">We could not record your vote. Please try again.</p>}
    </div>
  );
}
