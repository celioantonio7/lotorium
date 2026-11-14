import LottieClose from "../ui/LottieClose";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  useReducedMotion,
} from "motion/react";
import { site } from "../../data";
import Icon from "../ui/Icon";
export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("#inicio");
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const desktop = matchMedia("(min-width: 1001px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  useEffect(() => {
    let frame = 0;
    let previousY = window.scrollY;
    let directionStart = previousY;
    let direction = 0;
    const update = () => {
      frame = 0;
      const currentY = Math.max(0, window.scrollY);
      const nextDirection = Math.sign(currentY - previousY);
      if (nextDirection && nextDirection !== direction) { directionStart = previousY; direction = nextDirection; }
      if (currentY < 100) setHidden(false);
      else if (Math.abs(currentY - directionStart) > 12) setHidden(direction > 0);
      previousY = currentY;
      setScrolled(currentY > 50);
      let current = "#inicio";
      for (const s of document.querySelectorAll<HTMLElement>("main section"))
        if (s.getBoundingClientRect().top < innerHeight * 0.4)
          current = "#" + s.id;
      setActive(current);
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", scroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", scroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const siblings = [
      document.querySelector("main"),
      document.querySelector("footer"),
      document.querySelector("header"),
    ].filter(Boolean) as HTMLElement[];
    siblings.forEach((el) => (el.inert = true));
    window.dispatchEvent(new CustomEvent("lotorium:menu", { detail: true }));
    const timer = setTimeout(
      () => dialog.current?.querySelector<HTMLButtonElement>("button")?.focus(),
      60,
    );
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab") {
        const nodes =
          dialog.current?.querySelectorAll<HTMLElement>("a[href],button");
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const onResize = () => {
      if (innerWidth > 800) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
      document.documentElement.style.overflow = previousOverflow;
      siblings.forEach((el) => (el.inert = false));
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.dispatchEvent(new CustomEvent("lotorium:menu", { detail: false }));
      previousFocus?.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <>
      <header onFocusCapture={() => setHidden(false)} className={`header header-v2 ${scrolled ? "is-scrolled" : ""} ${hidden && !open ? "is-hidden" : ""}`}>
        <div className="header-shell">
          <a href="#inicio" className="wordmark" aria-label="Lotorium, início">
            <img src={site.brand.symbol} alt="" width="43" height="43" />
            <span>
              {site.brand.name.replace(/^l/i, "L")}
              <span className="wordmark-sub">{site.ui.brandDescriptor}</span>
            </span>
          </a>
          <nav aria-label="Menu principal" className="desktop-nav">
            {site.navigation
              .filter((x) => x.href !== "#contato")
              .map((x, i) => (
                <a
                  key={x.href}
                  href={x.href}
                  data-transition-label={x.label}
                  className={active === x.href ? "is-active" : ""}
                  aria-current={active === x.href ? "location" : undefined}
                >
                  <span className="nav-index">0{i + 1}</span>
                  <span className="nav-label">
                    <span>{x.label}</span>
                    <span aria-hidden="true">{x.label}</span>
                  </span>
                  <i />
                </a>
              ))}
          </nav>
          <a className="header-cta" href="#contato">
            <span>{site.ui.contactCta}</span>
            <ArrowUpRight size={17} />
          </a>
          <button
            ref={trigger}
            className={`menu-toggle ${open ? "is-open" : ""}`}
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <span>{site.ui.menuLabel}</span>
            <span className="hamburger">
              <i />
              <i />
            </span>
          </button>
        </div>
        <div className="reading-progress" aria-hidden="true" />
      </header>
      {createPortal(
        <LazyMotion features={domAnimation}>
          <AnimatePresence>
            {open && (
              <m.div
                ref={dialog}
                role="dialog"
                aria-modal="true"
                aria-label="Menu de navegação"
                className="menu-dialog"
                id="mobile-menu"
                data-lenis-prevent
                initial={{
                  clipPath: reduced
                    ? "none"
                    : "inset(0 0 100% 0 round 0 0 8% 8%)",
                  opacity: reduced ? 0 : 1,
                }}
                animate={{
                  clipPath: "inset(0 0 0% 0 round 0 0 0% 0%)",
                  opacity: 1,
                }}
                exit={{
                  clipPath: reduced
                    ? "none"
                    : "inset(0 0 100% 0 round 0 0 8% 8%)",
                  opacity: reduced ? 0 : 1,
                }}
                transition={{
                  duration: reduced ? 0.15 : 0.55,
                  ease: [0.76, 0, 0.24, 1],
                }}
              >
                <div className="menu-dialog-top">
                  <a
                    className="wordmark"
                    href="#inicio"
                    onClick={() => setOpen(false)}
                  >
                    <img
                      src={site.brand.symbol}
                      width="43"
                      height="43"
                      alt=""
                    />
                    <span>{site.brand.name.replace(/^l/i, "L")}</span>
                  </a>
                  <button
                    className="menu-close"
                    aria-label="Fechar menu"
                    onClick={() => setOpen(false)}
                  >
                    {site.ui.closeMenu}
                    <LottieClose />
                  </button>
                </div>
                <div className="menu-dialog-grid">
                  <nav className="mobile-nav" aria-label="Menu móvel">
                    <span className="eyebrow">{site.ui.menuEyebrow}</span>
                    {site.navigation.map((x, i) => (
                      <m.a
                        initial={{ y: reduced ? 0 : 45, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          delay: reduced ? 0 : 0.15 + i * 0.055,
                          duration: 0.45,
                        }}
                        key={x.href}
                        href={x.href}
                        data-transition-label={x.label}
                        onClick={() => setOpen(false)}
                        className={active === x.href ? "is-active" : ""}
                      >
                        <span className="menu-link-index mono">0{i + 1}</span>
                        <span className="menu-link-text">
                          {x.label}
                          <small>{x.caption}</small>
                        </span>
                        <span className="menu-link-arrow">
                          <Icon name={x.icon} size={22} />
                          <ArrowUpRight size={26} />
                        </span>
                      </m.a>
                    ))}
                  </nav>
                  <div className="menu-side">
                    <p>{site.ui.menuDescription}</p>
                    <span className="eyebrow">{site.ui.menuProductsLabel}</span>
                    {site.products.items.map((p) => (
                      <a
                        key={p.name}
                        href={p.url}
                        onClick={() => setOpen(false)}
                        {...(p.url.startsWith("https://")
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                      >
                        {p.name}
                        <ArrowRight size={17} />
                      </a>
                    ))}
                    <img
                      src={site.brand.symbol}
                      width="200"
                      height="200"
                      alt=""
                    />
                  </div>
                </div>
                <div className="menu-dialog-bottom mono">
                  <span>
                    <i className="status-dot" />
                    {site.ui.menuStatus}
                  </span>
                  <span>{site.brand.tagline}</span>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </LazyMotion>,
        document.body,
      )}
    </>
  );
}
