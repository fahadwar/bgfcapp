import { useEffect, useMemo, useState } from 'react';
import { useAdmin } from '../../context/AdminContext.jsx';
import { useData } from '../../context/DataContext.jsx';

const emptyPlayer = () => ({ id: '', name: '', position: '', votes: 0 });

export default function VotingManager() {
  const { motm, matches } = useData();
  const { updateVotingConfig } = useAdmin();
  const [activeMatchId, setActiveMatchId] = useState(motm?.activeMatchId ?? '');
  const [opponent, setOpponent] = useState(motm?.opponent ?? '');
  const [isActive, setIsActive] = useState(motm?.isActive ?? true);
  const [players, setPlayers] = useState(() => motm?.players ?? [emptyPlayer(), emptyPlayer()]);

  useEffect(() => {
    setActiveMatchId(motm?.activeMatchId ?? '');
    setOpponent(motm?.opponent ?? '');
    setIsActive(motm?.isActive ?? true);
    setPlayers(motm?.players ?? [emptyPlayer(), emptyPlayer()]);
  }, [motm]);

  const matchOptions = useMemo(
    () =>
      [...(matches ?? [])]
        .filter((match) => match.status !== 'postponed')
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [matches]
  );

  useEffect(() => {
    if (!activeMatchId) return;
    const selectedMatch = matchOptions.find((match) => match.id === activeMatchId);
    if (selectedMatch) {
      setOpponent(selectedMatch.opponent);
    }
  }, [activeMatchId, matchOptions]);

  const updatePlayer = (index, key, value) => {
    setPlayers((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [key]: key === 'votes' ? Number(value) || 0 : value
      };
      return next;
    });
  };

  const addPlayer = () => {
    setPlayers((prev) => [...prev, emptyPlayer()]);
  };

  const removePlayer = (index) => {
    setPlayers((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const filteredPlayers = players
      .filter((player) => player.name)
      .map((player) => ({
        ...player,
        id: player.id || player.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      }));
    await updateVotingConfig({
      activeMatchId,
      opponent,
      isActive,
      players: filteredPlayers
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold text-white">Man of the Match Voting</h2>
        <p className="mt-2 text-sm text-white/60">
          Select the live fixture and manage the players supporters can vote for during the match.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/70">
            <span>Active match</span>
            <select
              value={activeMatchId}
              onChange={(event) => setActiveMatchId(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
            >
              <option value="">Select a match</option>
              {matchOptions.map((match) => (
                <option key={match.id} value={match.id}>
                  {new Date(match.date).toLocaleDateString()} · BGFC vs {match.opponent}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-white/70">
            <span>Opponent override</span>
            <input
              value={opponent}
              onChange={(event) => setOpponent(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
            />
          </label>
        </div>
        <label className="flex items-center gap-3 text-sm text-white/70">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-black/50 text-bgfc-gold focus:ring-bgfc-gold"
          />
          <span>Voting live</span>
        </label>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Players</p>
            <button
              type="button"
              onClick={addPlayer}
              className="rounded-full border border-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/70 transition hover:text-white"
            >
              Add player
            </button>
          </div>
          <div className="space-y-3">
            {players.map((player, index) => (
              <div key={`${player.id}-${index}`} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <label className="space-y-2 text-xs uppercase tracking-[0.25em] text-white/50">
                    Name
                    <input
                      value={player.name}
                      onChange={(event) => updatePlayer(index, 'name', event.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
                    />
                  </label>
                  <label className="space-y-2 text-xs uppercase tracking-[0.25em] text-white/50">
                    Position
                    <input
                      value={player.position ?? ''}
                      onChange={(event) => updatePlayer(index, 'position', event.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
                    />
                  </label>
                  <label className="space-y-2 text-xs uppercase tracking-[0.25em] text-white/50">
                    Identifier
                    <input
                      value={player.id}
                      onChange={(event) => updatePlayer(index, 'id', event.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
                      placeholder="auto-generated if blank"
                    />
                  </label>
                  <label className="space-y-2 text-xs uppercase tracking-[0.25em] text-white/50">
                    Votes
                    <input
                      type="number"
                      value={player.votes ?? 0}
                      onChange={(event) => updatePlayer(index, 'votes', event.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
                    />
                  </label>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removePlayer(index)}
                    className="rounded-full border border-red-500/40 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-300 transition hover:bg-red-500/10"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="rounded-full bg-bgfc-gold px-5 py-2 text-sm font-semibold text-bgfc-charcoal shadow-lg transition hover:bg-bgfc-gold/80"
          >
            Save voting setup
          </button>
        </div>
      </form>
    </div>
  );
}
