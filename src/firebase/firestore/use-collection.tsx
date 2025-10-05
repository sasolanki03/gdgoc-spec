
'use client';
import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  FirestoreDataConverter,
} from 'firebase/firestore';

const getConverter = <T,>(): FirestoreDataConverter<T> => ({
    toFirestore: (data: T): DocumentData => data as DocumentData,
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return { ...data, id: snapshot.id } as T;
    },
});

export function useCollection<T>(query: Query<DocumentData> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!query) {
      setData([]);
      setLoading(false);
      return;
    }
    
    const converter = getConverter<T>();
    const finalQuery = query.withConverter(converter);

    const unsubscribe = onSnapshot(
      finalQuery,
      (snapshot: QuerySnapshot<T>) => {
        const result: T[] = [];
        snapshot.forEach((doc) => {
          result.push(doc.data());
        });
        setData(result);
        setLoading(false);
        setError(null);
      },
      (err: FirestoreError) => {
        console.error('Error fetching collection:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
