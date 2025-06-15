import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import type { VoidEntry, NextAction } from '../types/void';
import { db } from '../firebase';

const VOIDS_COLLECTION = 'voids';
const NEXT_ACTIONS_COLLECTION = 'nextActions';

export const createVoidEntry = async (userId: string, voidData: Partial<VoidEntry>): Promise<string> => {
  const voidEntry = {
    ...voidData,
    userId,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, VOIDS_COLLECTION), voidEntry);
  
  if (voidData.nextAction) {
    const nextAction = {
      ...voidData.nextAction,
      voidId: docRef.id,
      userId,
      createdAt: serverTimestamp(),
      completed: false,
    };
    await addDoc(collection(db, NEXT_ACTIONS_COLLECTION), nextAction);
  }

  return docRef.id;
};

export const getTodaysNextActions = async (userId: string): Promise<NextAction[]> => {
  const nextActionsRef = collection(db, NEXT_ACTIONS_COLLECTION);
  const q = query(
    nextActionsRef,
    where('userId', '==', userId),
    where('completed', '==', false)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as NextAction[];
};

export const completeNextAction = async (actionId: string): Promise<void> => {
  const actionRef = doc(db, NEXT_ACTIONS_COLLECTION, actionId);
  await updateDoc(actionRef, {
    completed: true,
    completedAt: serverTimestamp()
  });
};
