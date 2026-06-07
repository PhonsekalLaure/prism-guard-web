import { useCallback, useState } from 'react';

export default function useActionLoading() {
  const [loadingActions, setLoadingActions] = useState({});

  const isActionLoading = useCallback(
    (key) => Boolean(loadingActions[key]),
    [loadingActions]
  );

  const runAction = useCallback(async (key, action) => {
    if (!key || typeof action !== 'function') return undefined;
    setLoadingActions((current) => ({ ...current, [key]: true }));
    try {
      return await action();
    } finally {
      setLoadingActions((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
  }, []);

  return { isActionLoading, runAction };
}
