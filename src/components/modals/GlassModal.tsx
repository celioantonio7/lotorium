import { useRef } from "react";
import type { ReactNode, PointerEvent } from "react";
import { createPortal } from "react-dom";
import { m, LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import { useOverlayLock } from "../../hooks/useOverlayLock";
import { site } from "../../data";
import LottieClose from "../ui/LottieClose";
export default function GlassModal({
  id,
  title,
  onClose,
  children,
}: {
  id: string;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useOverlayLock(ref, onClose);
  function move(e: PointerEvent<HTMLDivElement>) {
    if (reduced || e.pointerType !== "mouse") return;
    const b = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      "--modal-x",
      `${(e.clientX - b.left - b.width / 2) * 0.025}px`,
    );
    e.currentTarget.style.setProperty(
      "--modal-y",
      `${(e.clientY - b.top - b.height / 2) * 0.025}px`,
    );
  }
  return createPortal(
    <LazyMotion features={domAnimation}>
      <m.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0.1 : 0.25 }}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <m.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-title`}
          className="glass-modal"
          onPointerMove={move}
          onPointerLeave={(e) => {
            e.currentTarget.style.setProperty("--modal-x", "0px");
            e.currentTarget.style.setProperty("--modal-y", "0px");
          }}
          initial={{
            y: reduced ? 0 : 40,
            scale: reduced ? 1 : 0.97,
            opacity: 0,
          }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{
            duration: reduced ? 0.1 : 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="modal-chrome">
            <span className="mono">LOTORIUM / {title}</span>
            <button
              data-modal-close
              className="modal-close"
              aria-label={site.solutions.modal.closeLabel}
              onClick={onClose}
            >
              <span>Fechar</span>
              <LottieClose />
            </button>
          </div>
          <div
            className="modal-scroll"
            data-lenis-prevent
            onScroll={(e) =>
              e.currentTarget.style.setProperty(
                "--modal-scroll",
                `${e.currentTarget.scrollTop * 0.12}px`,
              )
            }
          >
            {children}
          </div>
        </m.div>
      </m.div>
    </LazyMotion>,
    document.body,
  );
}
