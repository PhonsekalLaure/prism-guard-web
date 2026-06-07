import { useCallback, useState } from 'react';

function defaultErrorMessage(error, fallback) {
  return error?.response?.data?.error || error?.message || fallback;
}

export default function useReportAction({
  loadingMessage,
  successMessage,
  errorFallback = 'Failed to complete report action.',
  run,
  afterSuccess,
  afterSettled,
  showNotification,
  getErrorMessage = defaultErrorMessage,
}) {
  const [phase, setPhase] = useState('idle');
  const loading = phase === 'running' || phase === 'refreshing';

  const execute = useCallback(async (...args) => {
    if (loading || typeof run !== 'function') return null;

    setPhase('running');
    const nextLoadingMessage = typeof loadingMessage === 'function'
      ? loadingMessage(...args)
      : loadingMessage;
    if (nextLoadingMessage) showNotification?.(nextLoadingMessage, 'loading', 0);

    try {
      const result = await run(...args);
      setPhase('refreshing');
      await afterSuccess?.(result, ...args);
      setPhase('success');

      const nextSuccessMessage = typeof successMessage === 'function'
        ? successMessage(result, ...args)
        : successMessage;
      if (nextSuccessMessage) showNotification?.(nextSuccessMessage, 'success');

      return result;
    } catch (error) {
      setPhase('error');
      showNotification?.(getErrorMessage(error, errorFallback), 'error');
      return null;
    } finally {
      await afterSettled?.();
      setPhase('idle');
    }
  }, [
    afterSuccess,
    afterSettled,
    errorFallback,
    getErrorMessage,
    loading,
    loadingMessage,
    run,
    showNotification,
    successMessage,
  ]);

  const reset = useCallback(() => setPhase('idle'), []);

  return {
    execute,
    loading,
    phase,
    reset,
  };
}
