import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

export type FirestoreItem<T> = T & {
  id: string;
};

export function useFirestoreCollection<T>(collectionName: string) {
  const [items, setItems] = useState<Array<FirestoreItem<T>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const nextItems = snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as T),
        }));
        setItems(nextItems);
        setLoading(false);
        setError("");
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [collectionName]);

  return { items, loading, error };
}

export async function createCollectionItem<T extends object>(
  collectionName: string,
  payload: T,
) {
  await addDoc(collection(db, collectionName), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateCollectionItem<T extends object>(
  collectionName: string,
  id: string,
  payload: Partial<T>,
) {
  await updateDoc(doc(db, collectionName, id), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCollectionItem(collectionName: string, id: string) {
  await deleteDoc(doc(db, collectionName, id));
}
