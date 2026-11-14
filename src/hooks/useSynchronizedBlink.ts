import { useEffect, useState, type RefObject } from "react";
import { site } from "../data";

// One phase for every mascot, even when an image loads or enters the viewport later.
const epoch = performance.now();

export function useSynchronizedBlink(ref: RefObject<HTMLElement | null>, ready: boolean) {
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    const host = ref.current;
    const { enabled, intervalMs, durationMs } = site.effects.blink;
    if (!host || !ready || !enabled) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      const phase = (performance.now() - epoch) % intervalMs;
      const isClosed = phase < durationMs;
      setClosed(isClosed);
      timer = setTimeout(tick, Math.max(1, (isClosed ? durationMs : intervalMs) - phase));
    };
    const sync = () => {
      clearTimeout(timer);
      setClosed(false);
      if (visible && !document.hidden && !reduced.matches) tick();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(host);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [ref, ready]);
  return closed;
}
