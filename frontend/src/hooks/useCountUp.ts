import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 to `target` using ease-out-quart.
 * Re-animates whenever `target` changes.
 * Pass `active: false` to skip animation and return the value instantly.
 */
export function useCountUp(target: number, options?: { duration?: number; active?: boolean }) {
  const duration = options?.duration ?? 650;
  const active = options?.active ?? true;

  const [value, setValue] = useState(active ? 0 : target);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setValue(target);
      return;
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startTimeRef.current = null;
    setValue(0);

    const tick = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const t = Math.min((now - startTimeRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4); // ease-out-quart
      setValue(target * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, active]);

  return value;
}
