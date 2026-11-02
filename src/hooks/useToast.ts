import { useState, useRef, useEffect, useCallback } from 'react';

export interface ToastState {
  message: string;
  fading: boolean;
}

type Timer = ReturnType<typeof setTimeout>;

function clearTimers(timers: Timer[]) {
  timers.forEach(clearTimeout);
  timers.length = 0;
}

export function useToast(visibleMs = 2500, fadeMs = 500) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timers = useRef<Timer[]>([]);

  // Clear pending timers if the page unmounts mid-toast.
  useEffect(() => {
    const pending = timers.current;
    return () => clearTimers(pending);
  }, []);

  const showToast = useCallback(
    (message: string) => {
      clearTimers(timers.current);
      setToast({ message, fading: false });
      timers.current.push(
        setTimeout(() => setToast((t) => (t ? { ...t, fading: true } : t)), visibleMs),
        setTimeout(() => setToast(null), visibleMs + fadeMs)
      );
    },
    [visibleMs, fadeMs]
  );

  return { toast, showToast };
}
