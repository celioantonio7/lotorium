import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { site } from "../../data";
const DarkVeil = lazy(() => import("./reactbits/DarkVeil"));
export default function ShaderBackground({
  className = "",
}: {
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const small = matchMedia("(max-width: 600px)");
    let intersecting = false;
    const update = () => {
      setMobile(small.matches);
      if (site.effects.shader.enabled && intersecting && !reduced.matches) setMounted(true);
      setActive(
        site.effects.shader.enabled &&
          intersecting &&
          !reduced.matches &&
          document.visibilityState !== "hidden",
      );
    };
    const io = new IntersectionObserver(
      (entries) => {
        intersecting = entries.some((e) => e.isIntersecting);
        update();
      },
      { rootMargin: "120px" },
    );
    io.observe(host);
    reduced.addEventListener("change", update);
    small.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      io.disconnect();
      reduced.removeEventListener("change", update);
      small.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const d = site.effects.shader;
  return (
    <div
      ref={ref}
      className={`shader-background ${className}`}
      aria-hidden="true"
    >
      <div className="shader-fallback" />
      {mounted && (
        <Suspense fallback={null}>
          <DarkVeil
            paused={!active}
            color={d.color}
            speed={mobile ? d.speed * 0.8 : d.speed}
            opacity={mobile ? d.mobileOpacity : d.opacity}
            brightness={d.brightness}
            flow={d.flow}
            warp={d.warp}
            sheen={d.sheen}
            glow={d.glow}
            scale={1.3}
            rotation={-20}
            grain={0.015}
            mouseInteraction={!mobile}
            mouseStrength={0.7}
            quality={mobile ? 0.5 : 0.65}
            dpr={Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)}
            intro={false}
          />
        </Suspense>
      )}
    </div>
  );
}
