import { useEffect } from "react";
import type { RefObject } from "react";
export function useOverlayLock(
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    const focused = document.activeElement as HTMLElement | null;
    const overflow = document.documentElement.style.overflow;
    const shell = document.querySelector<HTMLElement>(".site-shell");
    const previousInert = shell?.inert ?? false;
    document.documentElement.style.overflow = "hidden";
    if (shell) shell.inert = true;
    window.dispatchEvent(new CustomEvent("lotorium:menu", { detail: true }));
    const timer = setTimeout(
      () =>
        ref.current
          ?.querySelector<HTMLButtonElement>("[data-modal-close]")
          ?.focus({ preventScroll: true }),
      60,
    );
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab") {
        const nodes = ref.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]),a[href],input,select,textarea,[tabindex="0"]',
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = overflow;
      if (shell) shell.inert = previousInert;
      window.dispatchEvent(new CustomEvent("lotorium:menu", { detail: false }));
      focused?.focus({ preventScroll: true });
    };
  }, [ref, onClose]);
}
