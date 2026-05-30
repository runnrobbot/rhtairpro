import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

// ─── Generic CRUD hooks ───────────────────────────────────────────────────────

/** Listen to a collection in real-time */
export function useCollection(collectionName, orderField = null) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ref = collection(db, collectionName);
    const q = orderField ? query(ref, orderBy(orderField)) : ref;

    const unsub = onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [collectionName, orderField]);

  return { data, loading, error };
}

/** Get a single document once */
export async function getDocument(collectionName, docId) {
  const snap = await getDoc(doc(db, collectionName, docId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/** Set (create/overwrite) a document */
export async function setDocument(collectionName, docId, data) {
  await setDoc(doc(db, collectionName, docId), data, { merge: true });
}

/** Delete a document */
export async function deleteDocument(collectionName, docId) {
  await deleteDoc(doc(db, collectionName, docId));
}
