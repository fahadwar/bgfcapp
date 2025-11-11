import { createContext, useContext, useMemo } from 'react';
import {
  db,
  storage,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
  storageRef,
  uploadBytes,
  getDownloadURL
} from '../services/firebase.js';
import { useAuth } from './AuthContext.jsx';
import { useData } from './DataContext.jsx';
import { useUI } from './UIContext.jsx';

const AdminContext = createContext();

const fallbackId = () => `local-${Math.random().toString(36).slice(2, 10)}`;
const formatScoreDisplay = (score) => {
  if (!score) return '';
  if (typeof score === 'string') return score;
  const home = score.bgfc ?? score.home ?? '';
  const opp = score.opp ?? score.away ?? '';
  if (home === '' && opp === '') return '';
  return `${home}-${opp}`;
};

export function AdminProvider({ children }) {
  const { user, isAdmin } = useAuth();
  const {
    promotions,
    matches,
    news,
    ticketLinks,
    motm,
    setPromotions,
    setMatches,
    setNews,
    setTicketLinks,
    setMotm,
    refreshData
  } = useData();
  const { showToast } = useUI();

  const ensureAdmin = () => {
    if (!isAdmin) {
      throw new Error('Admin privileges required');
    }
  };

  const uploadAsset = async (path, file) => {
    if (!storage) {
      throw new Error('Storage is not configured for uploads.');
    }
    const assetRef = storageRef(storage, path);
    await uploadBytes(assetRef, file);
    return getDownloadURL(assetRef);
  };

  const runAction = async (callback, { successMessage, refresh = true } = {}) => {
    try {
      ensureAdmin();
      const result = await callback();
      if (successMessage) {
        showToast(successMessage, 'success');
      }
      if (refresh) {
        await refreshData();
      }
      return result;
    } catch (error) {
      console.error('Admin action failed', error);
      showToast(error.message ?? 'Action failed', 'error');
      throw error;
    }
  };

  const withAudit = (payload) => ({
    ...payload,
    updatedAt: serverTimestamp(),
    updatedBy: user?.uid ?? 'unknown'
  });

  const createPromotion = async ({ values, file }) =>
    runAction(async () => {
      if (!db) {
        const id = fallbackId();
        setPromotions([...promotions, { id, ...values }]);
        return;
      }
      const promoRef = doc(collection(db, 'promotions'));
      let imageUrl = values.imageUrl ?? '';
      if (file) {
        imageUrl = await uploadAsset(`promotions/${promoRef.id}/${file.name}`, file);
      }
      await setDoc(promoRef, {
        ...values,
        imageUrl,
        createdAt: serverTimestamp(),
        ...withAudit({})
      });
    }, { successMessage: 'Promotion saved' });

  const updatePromotion = async (id, { values, file }) =>
    runAction(async () => {
      if (!db) {
        setPromotions(promotions.map((promo) => (promo.id === id ? { ...promo, ...values } : promo)));
        return;
      }
      const promoRef = doc(db, 'promotions', id);
      let nextValues = { ...values };
      if (file) {
        const imageUrl = await uploadAsset(`promotions/${id}/${file.name}`, file);
        nextValues = { ...nextValues, imageUrl };
      }
      await updateDoc(promoRef, withAudit(nextValues));
    }, { successMessage: 'Promotion updated' });

  const deletePromotion = async (id) =>
    runAction(
      async () => {
        if (!db) {
          setPromotions(promotions.filter((promo) => promo.id !== id));
          return;
        }
        await deleteDoc(doc(db, 'promotions', id));
      },
      { successMessage: 'Promotion deleted' }
    );

  const generateMatchId = (payload) => {
    if (payload.id) return payload.id;
    const datePart = (payload.date ?? '').replace(/[^0-9]/g, '').slice(0, 8);
    const opponent = (payload.opponent ?? 'match').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `${datePart || Date.now()}-${opponent}`;
  };

  const hydrateMatchValues = (values) => ({
    ...values,
    ticketsUrl: values.ticketsUrl ?? values.ticketUrl ?? '',
    ticketUrl: values.ticketUrl ?? values.ticketsUrl ?? '',
    scoreDisplay: formatScoreDisplay(values.score)
  });

  const createMatch = async (values) =>
    runAction(async () => {
      const id = generateMatchId(values);
      if (!db) {
        setMatches([
          ...matches.filter((match) => match.id !== id),
          { id, ...hydrateMatchValues(values) }
        ]);
        return;
      }
      const matchRef = doc(db, 'matches', id);
      await setDoc(matchRef, {
        ...hydrateMatchValues(values),
        createdAt: serverTimestamp(),
        ...withAudit({})
      });
    }, { successMessage: 'Match saved' });

  const updateMatch = async (id, values) =>
    runAction(async () => {
      if (!db) {
        setMatches(
          matches.map((match) =>
            match.id === id ? { ...match, ...hydrateMatchValues(values) } : match
          )
        );
        return;
      }
      const matchRef = doc(db, 'matches', id);
      await updateDoc(matchRef, withAudit(hydrateMatchValues(values)));
    }, { successMessage: 'Match updated' });

  const deleteMatch = async (id) =>
    runAction(
      async () => {
        if (!db) {
          setMatches(matches.filter((match) => match.id !== id));
          return;
        }
        await deleteDoc(doc(db, 'matches', id));
      },
      { successMessage: 'Match deleted' }
    );

  const importMatches = async (entries) =>
    runAction(async () => {
      if (!db) {
        setMatches(entries.map((entry) => ({ id: generateMatchId(entry), ...hydrateMatchValues(entry) })));
        return;
      }
      const batch = writeBatch(db);
      entries.forEach((entry) => {
        const id = generateMatchId(entry);
        const matchRef = doc(db, 'matches', id);
        batch.set(matchRef, {
          ...hydrateMatchValues(entry),
          createdAt: serverTimestamp(),
          ...withAudit({})
        });
      });
      await batch.commit();
    }, { successMessage: 'Matches imported' });

  const createNewsArticle = async (values) =>
    runAction(async () => {
      if (!db) {
        const id = fallbackId();
        setNews([...news, { id, ...values }]);
        return;
      }
      const newsRef = doc(collection(db, 'news'));
      await setDoc(newsRef, {
        ...values,
        createdAt: serverTimestamp(),
        ...withAudit({})
      });
    }, { successMessage: 'Article published' });

  const updateNewsArticle = async (id, values) =>
    runAction(async () => {
      if (!db) {
        setNews(news.map((article) => (article.id === id ? { ...article, ...values } : article)));
        return;
      }
      await updateDoc(doc(db, 'news', id), withAudit(values));
    }, { successMessage: 'Article updated' });

  const deleteNewsArticle = async (id) =>
    runAction(
      async () => {
        if (!db) {
          setNews(news.filter((article) => article.id !== id));
          return;
        }
        await deleteDoc(doc(db, 'news', id));
      },
      { successMessage: 'Article removed' }
    );

  const updateTicketLink = async (id, values) =>
    runAction(
      async () => {
        const nextLinks = {
          ...ticketLinks,
          [id]: { label: values.label, url: values.url }
        };
        if (!db) {
          setTicketLinks(nextLinks);
          return;
        }
        await setDoc(
          doc(db, 'tickets_links', id),
          {
            label: values.label,
            url: values.url,
            ...withAudit({})
          },
          { merge: true }
        );
        setTicketLinks(nextLinks);
      },
      { successMessage: 'Ticket link updated', refresh: false }
    );

  const updateVotingConfig = async (payload) =>
    runAction(async () => {
      const { activeMatchId, players, isActive = true, opponent } = payload;
      if (!db) {
        setMotm({ activeMatchId, players, opponent, isActive });
        return;
      }
      const voteRef = doc(db, 'motm_votes', activeMatchId);
      await setDoc(
        voteRef,
        {
          activeMatchId,
          opponent,
          players: players.reduce(
            (acc, player) => ({
              ...acc,
              [player.id]: {
                name: player.name,
                position: player.position ?? '',
                votes: player.votes ?? 0
              }
            }),
            {}
          ),
          isActive,
          ...withAudit({})
        },
        { merge: true }
      );
    }, { successMessage: 'Voting updated' });

  const value = useMemo(
    () => ({
      createPromotion,
      updatePromotion,
      deletePromotion,
      createMatch,
      updateMatch,
      deleteMatch,
      importMatches,
      createNewsArticle,
      updateNewsArticle,
      deleteNewsArticle,
      updateTicketLink,
      updateVotingConfig
    }),
    [
      promotions,
      matches,
      news,
      ticketLinks,
      motm,
      isAdmin
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
