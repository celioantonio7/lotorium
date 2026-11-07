import { setupStoryTransitions } from "../components/animations/storyTransitions";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { site } from "../data";
gsap.registerPlugin(ScrollTrigger);
export function useAnimations(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const mm = gsap.matchMedia();
    let cancelled = false;
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const settings = site.effects.scroll;
      const mobile = matchMedia("(max-width: 800px)").matches;
      const lenis = new Lenis({
        duration: settings.smoothDuration,
        smoothWheel: true,
        anchors: false,
        syncTouch: false,
      });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      let transitioning = false;
      let transition: gsap.core.Timeline | undefined;
      const onMenu = (event: Event) => {
        if ((event as CustomEvent<boolean>).detail) lenis.stop();
        else lenis.start();
      };
      window.addEventListener("lotorium:menu", onMenu);
      const onScrollRequest = (event: Event) => {
        const detail = (
          event as CustomEvent<{ target: number; immediate?: boolean }>
        ).detail;
        lenis.start();
        lenis.resize();
        lenis.scrollTo(detail.target, {
          immediate: detail.immediate ?? true,
          force: true,
        });
      };
      window.addEventListener("lotorium:scroll-to", onScrollRequest);
      const onAnchor = (event: MouseEvent) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        const link = event
          .composedPath()
          .find(
            (node): node is HTMLAnchorElement =>
              node instanceof HTMLAnchorElement,
          );
        if (
          !link ||
          !link.hash ||
          link.origin !== location.origin ||
          link.pathname !== location.pathname ||
          link.target === "_blank"
        )
          return;
        const target = document.getElementById(
          decodeURIComponent(link.hash.slice(1)),
        );
        if (!target) return;
        event.preventDefault();
        if (transitioning) return;
        const updateHistory = () => {
          if (location.hash !== link.hash)
            history.pushState(null, "", link.hash);
          if (link.classList.contains("skip-link")) {
            target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
          }
        };
        const position = () => {
          if (target.id === "produtos") {
            const chapter = ScrollTrigger.getById("arc-story");
            if (chapter) return chapter.end;
          }
          const node = target.closest<HTMLElement>(".pin-spacer") ?? target;
          return Math.max(
            0,
            node.getBoundingClientRect().top + window.scrollY - 96,
          );
        };
        const overlay = document.querySelector<HTMLElement>(
          ".navigation-transition",
        );
        const useTransition =
          settings.menuTransitions &&
          overlay &&
          link.closest("header,.menu-dialog,.footer") &&
          Math.abs(position() - scrollY) > innerHeight * 0.7;
        if (useTransition) {
          transitioning = true;
          const label = overlay.querySelector(".transition-target");
          if (label)
            label.textContent =
              link.dataset.transitionLabel ||
              link.textContent
                ?.trim()
                .replace(/\s+/g, " ")
                .replace(/^0\d\s*/, "")
                .slice(0, 40) ||
              site.brand.name;
          transition = gsap
            .timeline({
              onComplete: () => {
                transitioning = false;
              },
            })
            .set(overlay, { visibility: "visible" })
            .set(".transition-panel", { transformOrigin: "bottom", scaleY: 0 })
            .to(".transition-panel", {
              scaleY: 1,
              duration: 0.35,
              stagger: 0.035,
              ease: "power3.inOut",
            })
            .to(
              ".transition-caption",
              { autoAlpha: 1, y: 0, duration: 0.15 },
              0.2,
            )
            .call(
              () => {
                lenis.start();
                lenis.resize();
                lenis.scrollTo(position(), { immediate: true, force: true });
                updateHistory();
              },
              [],
              0.46,
            )
            .to(
              ".transition-caption",
              { autoAlpha: 0, y: -12, duration: 0.16 },
              0.5,
            )
            .set(".transition-panel", { transformOrigin: "top" }, 0.6)
            .to(
              ".transition-panel",
              {
                scaleY: 0,
                duration: 0.4,
                stagger: 0.035,
                ease: "power3.inOut",
              },
              0.6,
            )
            .set(overlay, { visibility: "hidden" });
        } else {
          lenis.start();
          lenis.resize();
          lenis.scrollTo(position(), {
            force: true,
            onComplete: updateHistory,
          });
        }
      };
      window.addEventListener("click", onAnchor);
      const ctx = gsap.context(() => {
        setupStoryTransitions();
        gsap.from(".hero-line > *", {
          yPercent: 115,
          opacity: 0,
          stagger: 0.12,
          duration: 1.1,
          ease: "power3.out",
          delay: 0.1,
        });
        gsap.from(".hero-reveal", {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          delay: 0.4,
        });
        gsap.from(".hero-art", {
          clipPath: "inset(0 0 100% 0)",
          duration: 1.4,
          ease: "power3.inOut",
        });
        gsap.to(".reading-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: true },
        });
        gsap.utils
          .toArray<HTMLElement>("main .section")
          .forEach((section, index) => {
            if (section.id === "produtos") return;
            const container = section.querySelector(":scope > .container");
            if (container && section.id !== "processo")
              gsap.fromTo(
                container,
                {
                  y: mobile ? 30 : settings.sectionDistance,
                  opacity: 0.3,
                  scale: mobile ? 1 : 0.985,
                },
                {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: section,
                    start: "top 98%",
                    end: mobile ? "top 62%" : "top 38%",
                    scrub: settings.scrub,
                  },
                },
              );
            const heading = section.querySelector(".section-heading");
            if (heading) {
              const words = heading.querySelectorAll(".title-word");
              gsap.fromTo(
                words,
                { yPercent: 105, rotate: mobile ? 0 : 3, opacity: 0.15 },
                {
                  yPercent: 0,
                  rotate: 0,
                  opacity: 1,
                  stagger: settings.wordStagger,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: heading,
                    start: "top 94%",
                    end: mobile ? "top 62%" : "top 45%",
                    scrub: settings.scrub,
                  },
                },
              );
              gsap.fromTo(
                heading.querySelector(".eyebrow"),
                { x: -16, opacity: 0.2 },
                {
                  x: 0,
                  opacity: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: section,
                    start: "top 95%",
                    end: "top 65%",
                    scrub: 0.5,
                  },
                },
              );
            }
            section.style.setProperty("--section-order", String(index));
            if (section.id !== "processo")
              gsap.fromTo(
                section,
                { "--section-reveal": 0 },
                {
                  "--section-reveal": 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "top 15%",
                    scrub: settings.scrub,
                  },
                },
              );
          });
        gsap.utils
          .toArray<HTMLElement>("[data-reveal]:not(.section-heading)")
          .forEach((el) => {
            if (
              el.matches(
                ".solution-card,.product-card,.process-step,.differences-grid article,.web-project",
              )
            )
              return;
            gsap.from(el, {
              y: mobile ? 18 : 28,
              opacity: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 95%", once: true },
            });
          });
        const scrubGroup = (selector: string, from: gsap.TweenVars) => {
          const els = gsap.utils.toArray<HTMLElement>(selector);
          if (!els.length) return;
          gsap.fromTo(els, from, {
            y: 0,
            x: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: els[0].parentElement,
              start: "top 95%",
              end: mobile ? "top 55%" : "top 35%",
              scrub: settings.scrub,
            },
          });
        };
        scrubGroup(".solution-card", {
          y: mobile ? 25 : 65,
          rotation: mobile ? 0 : 1.5,
          opacity: 0.2,
        });



        scrubGroup(".differences-grid article", {
          x: mobile ? 0 : -25,
          y: 25,
          opacity: 0.2,
        });
        gsap.fromTo(
          ".web-project",
          { clipPath: "inset(12% 0 12% 0 round 22px)", y: 40, scale: 0.94 },
          {
            clipPath: "inset(0% 0 0% 0 round 10px)",
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".web-project",
              start: "top 98%",
              end: "top 32%",
              scrub: settings.scrub,
            },
          },
        );
        gsap.utils.toArray<SVGPathElement>(".draw-path").forEach((path) => {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: path.closest("section"),
              start: "top 70%",
              end: "bottom 65%",
              scrub: 1,
            },
          });
        });
        gsap.fromTo(
          ".footer-reveal",
          { y: mobile ? 25 : 80 },
          {
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ".footer",
              start: "top bottom",
              end: "top 35%",
              scrub: 0.8,
            },
          },
        );
        gsap.fromTo(
          ".footer-cta-arrow",
          { rotation: -40 },
          {
            rotation: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ".footer-intro",
              start: "top bottom",
              end: "bottom 40%",
              scrub: 0.8,
            },
          },
        );
      });
      const processMedia = gsap.matchMedia();
      const setupProcess = (small: boolean) => {
        const section = document.querySelector<HTMLElement>("#processo");
        if (!section || !site.effects.process.pin) return;
        const svg = section.querySelector<SVGSVGElement>(
          small ? ".process-mobile-svg" : ".timeline-curve",
        );
        if (!svg) return;
        const paths = Array.from(
          svg.querySelectorAll<SVGPathElement>(
            ".process-progress-path,.process-progress-glow",
          ),
        );
        let length = 300;
        let previous = -1;
        let boundaries = [0, 0.25, 0.5, 0.75, 1];
        const measure = () => {
          if (!small) {
            const rect = svg.getBoundingClientRect();
            const points = Array.from(
              section.querySelectorAll<HTMLElement>(
                ".process-timeline .step-beacon",
              ),
            ).map((el) => {
              const r = el.getBoundingClientRect();
              return {
                x:
                  ((r.left + r.width / 2 - rect.left) * 1200) /
                  Math.max(1, rect.width),
                y:
                  ((r.top + r.height / 2 - rect.top) * 240) /
                  Math.max(1, rect.height),
              };
            });
            if (points.length === 5) {
              let d = `M${points[0].x} ${points[0].y}`;
              const lengths = [0];
              let sum = 0;
              points.slice(1).forEach((point, index) => {
                const prev = points[index];
                const mid = (point.x + prev.x) / 2;
                const segment = `M${prev.x} ${prev.y} C${mid} ${prev.y} ${mid} ${point.y} ${point.x} ${point.y}`;
                const temp = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "path",
                );
                temp.setAttribute("d", segment);
                sum += temp.getTotalLength();
                lengths.push(sum);
                d += ` C${mid} ${prev.y} ${mid} ${point.y} ${point.x} ${point.y}`;
              });
              svg
                .querySelectorAll("path")
                .forEach((path) => path.setAttribute("d", d));
              boundaries = lengths.map((v) => v / sum);
            }
          }
          length = paths[0]?.getTotalLength() ?? 300;
          paths.forEach((path) => {
            path.style.strokeDasharray = String(length);
          });
        };
        measure();
        const timeline = gsap.timeline({
          onUpdate: () => {
            const drawing = Math.min(1, timeline.time() / 4);
            let current = 0;
            boundaries.forEach((p, i) => {
              if (drawing + 0.002 >= p) current = i;
            });
            if (current !== previous) {
              previous = current;
              window.dispatchEvent(
                new CustomEvent("lotorium:process-step", { detail: current }),
              );
            }
          },
          scrollTrigger: {
            id: "process-pinned",
            trigger: section,
            start: "top top",
            end: () =>
              `+=${innerHeight * (small ? site.effects.process.mobileScrollScreens : site.effects.process.desktopScrollScreens)}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: site.effects.process.scrub,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
          },
        });
        timeline
          .fromTo(
            paths,
            { strokeDashoffset: () => length },
            { strokeDashoffset: 0, duration: 4, ease: "none" },
            0,
          )
          .fromTo(
            ".process-scroll-fill",
            { scaleX: 0 },
            { scaleX: 1, duration: 4, ease: "none" },
            0,
          )
          .to({}, { duration: 0.9 });
        ScrollTrigger.sort();
        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
          window.dispatchEvent(
            new CustomEvent("lotorium:process-step", { detail: 0 }),
          );
        };
      };
      processMedia.add("(min-width: 801px)", () => setupProcess(false));
      processMedia.add("(max-width: 800px)", () => setupProcess(true));
      const desktop = gsap.matchMedia();
      desktop.add("(min-width: 900px) and (pointer: fine)", () => {
        gsap.to(".hero-art .mascot", {
          y: 75,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        const hero = document.querySelector<HTMLElement>(".hero");
        const xTo = gsap.quickTo(".hero-art", "x", {
          duration: 0.8,
          ease: "power3.out",
        });
        const yTo = gsap.quickTo(".hero-art", "y", {
          duration: 0.8,
          ease: "power3.out",
        }); 
        const move = (e: PointerEvent) => {
          xTo((e.clientX / innerWidth - 0.5) * 20);
          yTo((e.clientY / innerHeight - 0.5) * 15);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        hero?.addEventListener("pointermove", move);
        hero?.addEventListener("pointerleave", leave);
        return () => {
          hero?.removeEventListener("pointermove", move);
          hero?.removeEventListener("pointerleave", leave);
        };
      });
      document.fonts.ready.then(() => {
        if (!cancelled) { ScrollTrigger.sort(); ScrollTrigger.refresh(); }
      });
      return () => {
        transition?.kill();
        processMedia.revert();
        desktop.revert();
        ctx.revert();
        window.removeEventListener("click", onAnchor);
        window.removeEventListener("lotorium:menu", onMenu);
        window.removeEventListener("lotorium:scroll-to", onScrollRequest);
        gsap.ticker.remove(tick);
        lenis.destroy();
        gsap.set(".navigation-transition", { clearProps: "all" });
        gsap.set(".transition-panel,.transition-caption", {
          clearProps: "all",
        });
      };
    });
    return () => {
      cancelled = true;
      mm.revert();
    };
  }, [enabled]);
}
