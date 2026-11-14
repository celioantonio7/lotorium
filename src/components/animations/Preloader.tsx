import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { site } from "../../data";
const full = "M0 0 H100 V100 Q50 100 0 100 Z";
const curve = "M0 0 H100 V35 Q50 100 0 35 Z";
const clear = "M0 0 H100 V0 Q50 0 0 0 Z";
export default function Preloader({
  onReveal,
  onFinish,
}: {
  onReveal: () => void;
  onFinish: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const release = useRef<() => void>(() => {});
  const [loaded, setLoaded] = useState(0);
  useEffect(() => {
    let disposed = false;
    let leaving = false;
    let timeline: gsap.core.Timeline | undefined;
    const rootEl = document.documentElement;
    const overflow = rootEl.style.overflow;
    rootEl.style.overflow = "hidden";
    const started = performance.now();
    const paths = root.current?.querySelectorAll(".intro-curtain path");
    const begin = () => {
      if (disposed || leaving) return;
      leaving = true;
      rootEl.style.overflow = overflow;
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      timeline = gsap.timeline({
        onComplete: () => {
          if (!disposed) onFinish();
        },
      });
      timeline
        .to(".intro-center,.intro-bottom", {
          opacity: 0,
          y: reduced ? 0 : -22,
          duration: 0.2,
        })
        .call(onReveal, [], 0.08);
      if (paths && !reduced) {
        timeline
          .to(
            paths,
            {
              attr: { d: curve },
              duration: 0.4,
              stagger: 0.07,
              ease: "power3.in",
            },
            0.1,
          )
          .to(
            paths,
            {
              attr: { d: clear },
              duration: 0.5,
              stagger: 0.07,
              ease: "power3.out",
            },
            0.49,
          );
      } else {
        timeline.to(root.current, { opacity: 0, duration: 0.15 });
      }
    };
    release.current = begin;
    const image = new Image();
    image.src = site.brand.mascot;
    const tasks = [
      document.fonts.ready,
      image.decode().catch(() => {}),
      import("./reactbits/DarkVeil"),
    ];
    const tracked = tasks.map((task) =>
      Promise.resolve(task).finally(() => {
        if (!disposed) setLoaded((n) => n + 1);
      }),
    );
    const maxTimer = setTimeout(begin, site.effects.preloader.timeout);
    Promise.allSettled(tracked).then(() => {
      const delay = Math.max(
        0,
        site.effects.preloader.minimumDuration - (performance.now() - started),
      );
      if (!disposed) minimumTimer = setTimeout(begin, delay);
    });
    let minimumTimer: ReturnType<typeof setTimeout> | undefined;
    return () => {
      disposed = true;
      clearTimeout(maxTimer);
      clearTimeout(minimumTimer);
      timeline?.kill();
      rootEl.style.overflow = overflow;
    };
  }, [onReveal, onFinish]);
  return (
    <div
      className="preloader"
      ref={root}
      role="status"
      aria-label="Carregando Lotorium"
    >
      <svg
        className="intro-curtain curtain-lime"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={full} />
      </svg>
      <svg
        className="intro-curtain curtain-dark"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={full} />
      </svg>
      <div className="intro-center">
        <div className="intro-symbol">
          <svg className="intro-orbit" viewBox="0 0 180 180" aria-hidden="true">
            <circle cx="90" cy="90" r="82" />
            <circle cx="90" cy="90" r="70" />
          </svg>
          <img src={site.brand.symbol} alt="" width="110" height="110" />
        </div>
        <span className="intro-wordmark">
          {site.brand.name.replace(/^l/i, "L")}
          <sup>®</sup>
        </span>
        <span className="mono">{site.ui.loadingLabel}</span>
        <div className="intro-loading-track">
          <span style={{ transform: `scaleX(${loaded / 3})` }} />
        </div>
        <p>{site.ui.loadingCaption}</p>
      </div>
      <div className="intro-bottom mono">
        <span>{site.ui.brandDescriptor}</span>
        <button onClick={() => release.current()}>
          {site.ui.skipIntro}
          <span>↗</span>
        </button>
      </div>
    </div>
  );
}
