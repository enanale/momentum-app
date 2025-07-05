import { useState, useEffect, useCallback } from 'react';
import { serverTimestamp } from 'firebase/firestore';
import type { NextAction } from '../types/void';
import {
  getTodaysNextActions,
  completeNextAction,
  uncompleteNextAction,
  createNextAction,
} from '../services/voidService';

export const useNextActions = (userId: string, refreshTrigger: number) => {
  const [actions, setActions] = useState<NextAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const forceRefresh = useCallback(() => {
    setRefreshKey(key => key + 1);
  }, []);

  useEffect(() => {
    const fetchActions = async () => {
      if (!userId) return;
      setLoading(true);
      setError(null);
      try {
        const todaysActions = await getTodaysNextActions(userId);
        setActions(todaysActions);
      } catch (err) {
        console.error('Error fetching next actions:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, [userId, refreshTrigger, refreshKey]);

  const handleToggle = useCallback(async (actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    if (!action) return { completed: false };

    try {
      if (action.completed) {
        await uncompleteNextAction(actionId);
        setActions(prevActions =>
          prevActions.map(a =>
            a.id === actionId
              ? { ...a, completed: false, completedAt: undefined }
              : a
          )
        );
        return { completed: false };
      } else {
        await completeNextAction(actionId);
        setActions(prevActions =>
          prevActions.map(a =>
            a.id === actionId
              ? { ...a, completed: true, completedAt: serverTimestamp() }
              : a
          )
        );
        return { completed: true };
      }
    } catch (err) {
      console.error('Error toggling action completion:', err);
      setError(err as Error);
      // Revert optimistic update on error
      setActions(actions);
      return { completed: action.completed };
    }
  }, [actions]);

  const handleSaveNextAction = useCallback(async (description: string) => {
    if (!userId) return;
    try {
      await createNextAction(userId, description);
      forceRefresh();
    } catch (err) {
      console.error('Error creating next action:', err);
      setError(err as Error);
    }
  }, [userId, forceRefresh]);

  return {
    actions,
    loading,
    error,
    handleToggle,
    handleSaveNextAction,
  };
};
