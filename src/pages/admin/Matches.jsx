import { useMemo, useState } from 'react';
import AdminModal from '../../components/admin/AdminModal.jsx';
import { useAdmin } from '../../context/AdminContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { useUI } from '../../context/UIContext.jsx';

const emptyMatch = {
  id: '',
  opponent: '',
  date: '',
  home: true,
  status: 'upcoming',
  scoreBgfc: '',
  scoreOpp: '',
  venue: '',
  city: '',
  competition: 'USL Championship',
  ticketUrl: '',
  mapUrl: '',
  logoUrl: '',
  broadcast: 'BGFC+ App'
};

const toLocalInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const toIso = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return date.toISOString();
};

const parseCsvText = (text) => {
  const rows = [];
  let currentField = '';
  let currentRow = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        currentField += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && text[i + 1] === '\n') {
        i += 1;
      }
      currentRow.push(currentField);
      rows.push(currentRow);
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField || currentRow.length) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  if (!rows.length) return [];
  const headers = rows[0].map((header) => header.trim());
  return rows
    .slice(1)
    .map((row) => {
      const record = {};
      headers.forEach((header, index) => {
        record[header] = (row[index] ?? '').trim();
      });
      return record;
    })
    .filter((row) => Object.values(row).some((value) => value !== ''));
};

export default function MatchesManager() {
  const { matches } = useData();
  const { createMatch, updateMatch, deleteMatch, importMatches } = useAdmin();
  const { showToast } = useUI();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formValues, setFormValues] = useState(emptyMatch);

  const orderedMatches = useMemo(
    () =>
      [...(matches ?? [])]
        .map((match) => ({
          ...match,
          scoreBgfc:
            typeof match.score === 'object'
              ? match.score.bgfc ?? ''
              : match.scoreDisplay?.split('-')[0] ?? '',
          scoreOpp:
            typeof match.score === 'object'
              ? match.score.opp ?? ''
              : match.scoreDisplay?.split('-')[1] ?? '',
          ticketUrl: match.ticketUrl ?? match.ticketsUrl ?? '',
          mapUrl: match.mapUrl ?? '',
          logoUrl: match.logoUrl ?? match.opponentLogo ?? '',
          date: match.date
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [matches]
  );

  const openModal = (match) => {
    if (match) {
      setEditing(match);
      setFormValues({
        ...emptyMatch,
        ...match,
        id: match.id,
        opponent: match.opponent,
        date: toLocalInput(match.date),
        home: match.home ?? true,
        status: match.status ?? 'upcoming',
        scoreBgfc:
          typeof match.score === 'object'
            ? match.score.bgfc ?? ''
            : match.scoreDisplay?.split('-')[0] ?? match.score ?? '',
        scoreOpp:
          typeof match.score === 'object'
            ? match.score.opp ?? ''
            : match.scoreDisplay?.split('-')[1] ?? '',
        venue: match.venue ?? '',
        city: match.city ?? '',
        competition: match.competition ?? 'USL Championship',
        ticketUrl: match.ticketUrl ?? match.ticketsUrl ?? '',
        mapUrl: match.mapUrl ?? '',
        logoUrl: match.logoUrl ?? match.opponentLogo ?? '',
        broadcast: match.broadcast ?? 'BGFC+ App'
      });
    } else {
      setEditing(null);
      setFormValues(emptyMatch);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setFormValues(emptyMatch);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const buildPayload = () => ({
    opponent: formValues.opponent,
    date: toIso(formValues.date),
    home: Boolean(formValues.home),
    status: formValues.status,
    score: formValues.status === 'final' ? { bgfc: formValues.scoreBgfc, opp: formValues.scoreOpp } : null,
    venue: formValues.venue,
    city: formValues.city,
    competition: formValues.competition,
    ticketUrl: formValues.ticketUrl,
    ticketsUrl: formValues.ticketUrl,
    mapUrl: formValues.mapUrl,
    logoUrl: formValues.logoUrl,
    broadcast: formValues.broadcast
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = buildPayload();
    if (editing?.id) {
      await updateMatch(editing.id, payload);
    } else {
      await createMatch(payload);
    }
    closeModal();
  };

  const handleDelete = async (matchId) => {
    if (!window.confirm('Delete this match?')) return;
    await deleteMatch(matchId);
  };

  const handleCsvUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = parseCsvText(text);
      const entries = data
        .filter((row) => row.opponent && row.date)
        .map((row) => ({
          opponent: row.opponent,
          date: toIso(row.date),
          home: row.home === 'true' || row.home === true || row.home === '1',
          status: row.status ?? 'upcoming',
          score:
            row['score.bgfc'] || row['score.opp']
              ? { bgfc: row['score.bgfc'] ?? '', opp: row['score.opp'] ?? '' }
              : null,
          venue: row.venue ?? '',
          city: row.city ?? '',
          competition: row.competition ?? 'USL Championship',
          ticketUrl: row.ticketUrl ?? row.ticketsUrl ?? '',
          ticketsUrl: row.ticketUrl ?? row.ticketsUrl ?? '',
          mapUrl: row.mapUrl ?? '',
          logoUrl: row.logoUrl ?? '',
          broadcast: row.broadcast ?? 'BGFC+ App'
        }));
      if (!entries.length) {
        showToast('No valid matches found in CSV.', 'warning');
        return;
      }
      await importMatches(entries);
      event.target.value = '';
    } catch (error) {
      console.error('CSV parse error', error);
      showToast('Unable to parse CSV. Check formatting and try again.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold text-white">Matches</h2>
          <p className="text-sm text-white/60">Manage fixtures that power the schedule and ticket journeys.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/70 transition hover:text-white">
            <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
            Import CSV
          </label>
          <button
            type="button"
            onClick={() => openModal(null)}
            className="inline-flex items-center justify-center rounded-full bg-bgfc-gold px-5 py-2 text-sm font-semibold text-bgfc-charcoal shadow-lg transition hover:bg-bgfc-gold/80"
          >
            New match
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.25em] text-white/50">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Opponent</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Venue</th>
              <th className="px-4 py-3">Tickets</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orderedMatches.map((match) => (
              <tr key={match.id} className="text-sm text-white/80">
                <td className="px-4 py-3">{new Date(match.date).toLocaleString()}</td>
                <td className="px-4 py-3 font-semibold text-white">BGFC vs {match.opponent}</td>
                <td className="px-4 py-3 capitalize">{match.status}</td>
                <td className="px-4 py-3">{match.venue}</td>
                <td className="px-4 py-3">
                  <a href={match.ticketUrl ?? match.ticketsUrl} className="text-bgfc-gold underline" rel="noreferrer" target="_blank">
                    View
                  </a>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openModal(match)}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/70 transition hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(match.id)}
                      className="rounded-full border border-red-500/40 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-300 transition hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'Edit Match' : 'Create Match'}
        description="Sync fixtures with the public schedule, ticketing links, and voting modules."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/70">
              <span>Opponent</span>
              <input
                name="opponent"
                value={formValues.opponent}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-white/70">
              <span>Date &amp; Time</span>
              <input
                type="datetime-local"
                name="date"
                value={formValues.date}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
              />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm text-white/70">
              <span>Venue</span>
              <input
                name="venue"
                value={formValues.venue}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-white/70">
              <span>City</span>
              <input
                name="city"
                value={formValues.city}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-white/70">
              <span>Broadcast</span>
              <input
                name="broadcast"
                value={formValues.broadcast}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
              />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/70">
              <span>Ticket URL</span>
              <input
                name="ticketUrl"
                value={formValues.ticketUrl}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-white/70">
              <span>Map URL</span>
              <input
                name="mapUrl"
                value={formValues.mapUrl}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
              />
            </label>
          </div>
          <label className="space-y-2 text-sm text-white/70">
            <span>Opponent Logo URL</span>
            <input
              name="logoUrl"
              value={formValues.logoUrl}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/70">
              <span>Status</span>
              <select
                name="status"
                value={formValues.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
              >
                <option value="upcoming">Upcoming</option>
                <option value="final">Final</option>
                <option value="postponed">Postponed</option>
              </select>
            </label>
            <label className="flex items-center gap-3 text-sm text-white/70">
              <input
                type="checkbox"
                name="home"
                checked={Boolean(formValues.home)}
                onChange={handleChange}
                className="h-4 w-4 rounded border-white/20 bg-black/50 text-bgfc-gold focus:ring-bgfc-gold"
              />
              <span>Home match</span>
            </label>
          </div>
          {formValues.status === 'final' && (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-white/70">
                <span>BGFC Score</span>
                <input
                  name="scoreBgfc"
                  value={formValues.scoreBgfc}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-white/70">
                <span>Opponent Score</span>
                <input
                  name="scoreOpp"
                  value={formValues.scoreOpp}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-bgfc-gold focus:outline-none"
                />
              </label>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/70 transition hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-bgfc-gold px-5 py-2 text-sm font-semibold text-bgfc-charcoal shadow-lg transition hover:bg-bgfc-gold/80"
            >
              {editing ? 'Save match' : 'Create match'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
