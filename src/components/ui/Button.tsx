import { useRef } from "react";
import type { ReactNode, MouseEvent } from "react";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
export default function Button({
  children,
  href,
  secondary = false,
  className = "",
}: {
  children: ReactNode;
  href: string;
  secondary?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  function move(e: MouseEvent<HTMLAnchorElement>) {
    if (
      !window.matchMedia(
        "(pointer:fine) and (prefers-reduced-motion:no-preference)",
      ).matches
    )
      return;
    const b = e.currentTarget.getBoundingClientRect();
    gsap.to(ref.current, {
      x: (e.clientX - b.left - b.width / 2) * 0.1,
      y: (e.clientY - b.top - b.height / 2) * 0.16,
      duration: 0.35,
    });
  }
  return (
    <a
      ref={ref}
      href={href}
      className={`button ${secondary ? "button-secondary" : ""} ${className}`}
      onMouseMove={move}
      onMouseLeave={() => gsap.to(ref.current, { x: 0, y: 0, duration: 0.4 })}
    >
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </a>
  );
}
