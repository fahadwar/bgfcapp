import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  db,
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  increment,
  hasFirebaseConfig
} from '../services/firebase.js';
import {
  mockPromotions,
  mockMatches,
  mockNews,
  mockFanZoneSections,
  mockTicketLinks,
  mockVoting
} from '../services/mockData.js';

const DataContext = createContext();

const STORAGE_KEY = 'bgfc-motm-votes';

const getStoredVotes = () => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Unable to parse stored votes', error);
    return {};
  }
};

const setStoredVotes = (payload) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

const normalizeVotingDoc = (docSnapshot) => {
  if (!docSnapshot) return mockVoting;
  const data = docSnapshot.data ? docSnapshot.data() : docSnapshot;
  const playerEntries = Array.isArray(data.players)
    ? data.players
    : Object.entries(data.players ?? {}).map(([playerId, value]) => ({ id: playerId, ...value }));

  return {
    activeMatchId: data.activeMatchId ?? docSnapshot.id ?? mockVoting.activeMatchId,
    opponent: data.opponent ?? mockVoting.opponent,
    players: playerEntries.map((player) => ({
      id: player.id,
      name: player.name ?? 'Player',
      position: player.position ?? 'POS',
      votes: player.votes ?? (typeof player === 'number' ? player : 0)
    }))
  };
};

export function DataProvider({ children }) {
  const [promotions, setPromotions] = useState(mockPromotions);
  const [matches, setMatches] = useState(mockMatches);
  const [news, setNews] = useState(mockNews);
  const [fanZoneSections, setFanZoneSections] = useState(mockFanZoneSections);
  const [ticketLinks, setTicketLinks] = useState(mockTicketLinks);
  const [motm, setMotm] = useState(mockVoting);
  const [loading, setLoading] = useState(Boolean(db));
  const [userVotes, setUserVotes] = useState(getStoredVotes);

  useEffect(() => {
    const fetchCollections = async () => {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [promosSnap, matchesSnap, newsSnap, ticketsSnap, votingSnap] = await Promise.all([
          getDocs(collection(db, 'promotions')),
          getDocs(collection(db, 'matches')),
          getDocs(collection(db, 'news')),
          getDocs(collection(db, 'tickets_links')),
          getDocs(collection(db, 'motm_votes'))
        ]);

        const nextPromotions = promosSnap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
        const nextMatches = matchesSnap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
        const nextNews = newsSnap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
        const nextTickets = ticketsSnap.docs.reduce((acc, docSnap) => ({ ...acc, [docSnap.id]: docSnap.data().url }), {});
        const activeVotingDoc = votingSnap.docs.find((voteDoc) => voteDoc.data().isActive);
        const nextVoting = normalizeVotingDoc(activeVotingDoc ?? votingSnap.docs[0]);

        setPromotions(nextPromotions.length ? nextPromotions : mockPromotions);
        setMatches(nextMatches.length ? nextMatches : mockMatches);
        setNews(nextNews.length ? nextNews : mockNews);
        setTicketLinks(Object.keys(nextTickets).length ? nextTickets : mockTicketLinks);
        setMotm(nextVoting || mockVoting);
      } catch (error) {
        console.error('Error fetching Firestore data', error);
        setPromotions(mockPromotions);
        setMatches(mockMatches);
        setNews(mockNews);
        setTicketLinks(mockTicketLinks);
        setMotm(mockVoting);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  useEffect(() => {
    setStoredVotes(userVotes);
  }, [userVotes]);

  const voteForPlayer = async ({ matchId, playerId, uid }) => {
    if (!matchId || !playerId || !uid) {
      throw new Error('Invalid voting payload');
    }

    if (userVotes[matchId]) {
      return { alreadyVoted: true };
    }

    const updateState = () => {
      setMotm((prev) => {
        if (!prev || prev.activeMatchId !== matchId) return prev;
        const updatedPlayers = prev.players.map((player) =>
          player.id === playerId ? { ...player, votes: player.votes + 1 } : player
        );
        return {
          ...prev,
          players: updatedPlayers
        };
      });
      setUserVotes((prev) => ({ ...prev, [matchId]: playerId }));
    };

    updateState();

    if (!db) {
      return { alreadyVoted: false };
    }

    try {
      const voteRef = doc(db, 'motm_votes', matchId);
      await updateDoc(voteRef, {
        [`players.${playerId}.votes`]: increment(1),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      if (error.code === 'not-found') {
        await setDoc(doc(db, 'motm_votes', matchId), {
          activeMatchId: matchId,
          players: {
            [playerId]: {
              votes: 1
            }
          },
          updatedAt: new Date().toISOString(),
          isActive: true
        });
      } else {
        console.error('Unable to record vote', error);
      }
    }

    return { alreadyVoted: false };
  };

  const value = useMemo(
    () => ({
      promotions,
      matches,
      news,
      fanZoneSections,
      ticketLinks,
      motm,
      loading,
      voteForPlayer,
      hasFirebaseConfig
    }),
    [promotions, matches, news, fanZoneSections, ticketLinks, motm, loading]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
