import { useEffect, useRef } from "react";
import { site } from "../../data";

const greenMasks = new Map<string, HTMLCanvasElement>();

/** Original transparent artwork, with animated light restricted to its green pixels. */
export default function LavaImage({ variant, className = "" }: { variant: "about" | "aboutRocks" | "left" | "center" | "right"; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const art = site.visuals[variant];
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, visible = false, disposed = false, last = 0;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    let mask = document.createElement("canvas");
    const maskCtx = mask.getContext("2d", { willReadFrequently: true });
    const img = new Image();
    let ready = false;
    const stop = () => { cancelAnimationFrame(frame); frame = 0; };
    const draw = (time: number) => {
      if (disposed || !visible || document.hidden || reduced.matches || !ready || !ctx) { frame = 0; return; }
      frame = requestAnimationFrame(draw);
      if (time - last < 40) return;
      last = time;
      const w = canvas.width, h = canvas.height, t = time * .001 * site.visuals.lava.speed;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      const base = ctx.createLinearGradient(0, h, w, 0);
      base.addColorStop(0, "#5aff00"); base.addColorStop(.5, "#b7ff32"); base.addColorStop(1, "#eaff9c");
      ctx.fillStyle = base; ctx.globalAlpha = .3; ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      for (let i = 0; i < 7; i++) {
        const x = (Math.sin(t * .43 + i * 2.4) * .5 + .5) * w;
        const y = ((t * .07 + i * .173) % 1) * h;
        const r = w * (.13 + .035 * Math.sin(t + i));
        const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
        glow.addColorStop(0, "rgba(244,255,160,1)"); glow.addColorStop(.35, "rgba(159,255,30,.9)"); glow.addColorStop(1, "rgba(100,255,0,0)");
        ctx.fillStyle = glow; ctx.fillRect(x-r,y-r,r*2,r*2);
      }
      ctx.globalCompositeOperation = "destination-in"; ctx.drawImage(mask, 0, 0);
    };
    const sync = () => { stop(); if (visible && !reduced.matches && !img.src) img.src = art.src; if (ready && visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(draw); canvas.hidden = reduced.matches; };
    img.onload = () => {
      if (disposed || !ctx || !maskCtx) return;
      // Match the glow mask to the displayed pixels without enlarging the source artwork.
      const w = Math.min(Math.ceil(host.clientWidth * Math.min(devicePixelRatio || 1, 2)), art.width), h = Math.round(w * art.height / art.width);
      const key = `${art.src}:${w}`;
      canvas.width = w; canvas.height = h;
      const cached = greenMasks.get(key);
      if (cached) mask = cached;
      else {
        mask.width = w; mask.height = h;
        maskCtx.drawImage(img, 0, 0, w, h);
        const pixels = maskCtx.getImageData(0, 0, w, h);
        for (let i=0; i<pixels.data.length; i+=4) {
          const p = pixels.data;
          const green = Math.max(0, Math.min(1, (p[i+1] - p[i]*.85 - p[i+2]*.25 - 12)/65));
          p[i+3] = p[i+3] * green * Math.min(1,p[i+1]/160);
          p[i]=p[i+1]=p[i+2]=255;
        }
        maskCtx.putImageData(pixels,0,0);
        greenMasks.set(key,mask);
      }
      ready = true; host.append(canvas); sync();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(host); reduced.addEventListener("change",sync); document.addEventListener("visibilitychange",sync);
    return () => { disposed = true; stop(); observer.disconnect(); reduced.removeEventListener("change",sync); document.removeEventListener("visibilitychange",sync); canvas.remove(); img.onload = null; };
  }, [art]);
  return <div ref={ref} className={`lava-image ${className}`} style={{ aspectRatio: `${art.width}/${art.height}`, "--lava-intensity": site.visuals.lava.intensity } as React.CSSProperties} aria-hidden="true"><img src={art.src} width={art.width} height={art.height} alt="" loading="lazy" decoding="async" /></div>;
}
