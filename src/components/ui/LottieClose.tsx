import { useEffect, useRef, useState } from "react";
import type { AnimationItem } from "lottie-web";
import closeData from "../../data/close-icon.json";
export default function LottieClose() {
  const ref = useRef<HTMLSpanElement>(null);
  const anim = useRef<AnimationItem | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let instance: AnimationItem | undefined;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    import("lottie-web/build/player/lottie_light").then(
      ({ default: lottie }) => {
        if (cancelled || !ref.current) return;
        instance = lottie.loadAnimation({
          container: ref.current,
          renderer: "svg",
          loop: false,
          autoplay: !reduced.matches,
          animationData: structuredClone(closeData),
          rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
        });
        anim.current = instance;
        instance.addEventListener("DOMLoaded", () => {
          if (reduced.matches) instance?.goToAndStop(35, true);
          setReady(true);
        });
      },
    );
    return () => {
      cancelled = true;
      instance?.destroy();
      anim.current = null;
    };
  }, []);
  const play = () => {
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
      anim.current?.goToAndPlay(0, true);
  };
  return (
    <span
      className={`lottie-close ${ready ? "is-ready" : ""}`}
      onPointerEnter={play}
      aria-hidden="true"
    >
      <span ref={ref} className="lottie-canvas" />
      <span className="lottie-fallback">
        <i />
        <i />
      </span>
    </span>
  );
}
