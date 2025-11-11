import { useEffect, useState } from 'react';
import { collection, getDocs, db } from '../services/firebase.js';

export function useFirestoreCollection(collectionName, fallback = []) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(Boolean(db));
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, collectionName));
        if (!mounted) return;
        const payload = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
        setData(payload.length ? payload : fallback);
      } catch (err) {
        console.error(`Error loading collection ${collectionName}`, err);
        if (!mounted) return;
        setError(err);
        setData(fallback);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [collectionName, fallback]);

  return { data, loading, error };
}
