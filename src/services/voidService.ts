import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc, FirestoreError } from 'firebase/firestore';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import type { NextAction, VoidFormData } from '../types/void';
import { db } from '../firebase';

const VOIDS_COLLECTION = 'voids';
const NEXT_ACTIONS_COLLECTION = 'nextActions';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

class VoidServiceError extends Error {
  readonly cause?: Error;

  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'VoidServiceError';
    this.cause = cause;
  }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const withRetry = async <T>(operation: () => Promise<T>): Promise<T> => {
  let lastError: Error = new Error('Unknown error');

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < MAX_RETRIES && error instanceof FirestoreError) {
        console.warn(`Attempt ${attempt} failed, retrying in ${RETRY_DELAY}ms...`);
        await delay(RETRY_DELAY * attempt); // Exponential backoff
        continue;
      }
      break;
    }
  }

  throw new VoidServiceError('Operation failed after max retries', lastError);
};

const parseNextAction = (doc: QueryDocumentSnapshot<DocumentData>): NextAction => {
  const data = doc.data();
  return {
    id: doc.id,
    description: data.description,
    estimatedMinutes: data.estimatedMinutes,
    voidId: data.voidId,
    userId: data.userId,
    createdAt: data.createdAt,
    completed: data.completed,
    completedAt: data.completedAt,
  };
};

export const createVoidEntry = async (userId: string, formData: VoidFormData): Promise<string> => {
  if (!userId) throw new VoidServiceError('User ID is required');
  const voidEntry = {
    title: formData.title,
    description: formData.description,
    userId,
    createdAt: serverTimestamp(),
  };

  const docRef = await withRetry(() => addDoc(collection(db, VOIDS_COLLECTION), voidEntry));
  
  if (formData.nextAction) {
    try {
    const nextAction = {
      description: formData.nextAction.description,
      estimatedMinutes: formData.nextAction.estimatedMinutes || 10,
      voidId: docRef.id,
      userId,
      createdAt: serverTimestamp(),
      completed: false,
    };
      await withRetry(() => addDoc(collection(db, NEXT_ACTIONS_COLLECTION), nextAction));
    } catch (error) {
      console.error('Failed to create next action:', error);
      throw new VoidServiceError('Failed to create next action', error instanceof Error ? error : undefined);
    }
  }

  return docRef.id;
};

export const getTodaysNextActions = async (userId: string): Promise<NextAction[]> => {
  if (!userId) throw new VoidServiceError('User ID is required');

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const nextActionsRef = collection(db, NEXT_ACTIONS_COLLECTION);
  const q = query(
    nextActionsRef,
    where('userId', '==', userId),
    where('createdAt', '>=', startOfToday),
    where('createdAt', '<=', endOfToday)
  );

  const snapshot = await withRetry(() => getDocs(q));
  const actions = snapshot.docs.map(doc => parseNextAction(doc));
  
  // Sort by creation date, then by completion status
  return actions.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    if (a.createdAt && b.createdAt) {
      // Timestamps can be null if just created and not yet set by server
      // This simple check might not be enough for complex cases
      const aTime = a.createdAt.toMillis ? a.createdAt.toMillis() : 0;
      const bTime = b.createdAt.toMillis ? b.createdAt.toMillis() : 0;
      return aTime - bTime;
    }
    return 0;
  });
};

export const completeNextAction = async (actionId: string): Promise<void> => {
  if (!actionId) throw new VoidServiceError('Action ID is required');

  const actionRef = doc(db, NEXT_ACTIONS_COLLECTION, actionId);
  await withRetry(() => updateDoc(actionRef, {
    completed: true,
    completedAt: serverTimestamp()
  }));
};

export const createNextAction = async (userId: string, description: string): Promise<string> => {
  if (!userId) throw new VoidServiceError('User ID is required');
  if (!description) throw new VoidServiceError('Description is required');

  const nextAction = {
    description,
    estimatedMinutes: 10, // Default estimated time
    userId,
    createdAt: serverTimestamp(),
    completed: false,
  };

  const docRef = await withRetry(() => addDoc(collection(db, NEXT_ACTIONS_COLLECTION), nextAction));
  return docRef.id;
};

export const uncompleteNextAction = async (actionId: string): Promise<void> => {
  if (!actionId) throw new VoidServiceError('Action ID is required');

  const actionRef = doc(db, NEXT_ACTIONS_COLLECTION, actionId);
  await withRetry(() => updateDoc(actionRef, {
    completed: false,
    completedAt: null
  }));
};
