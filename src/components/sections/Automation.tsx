import TerrainSides from "../ui/TerrainSides";
import { Brain } from "lucide-react";
import { useEffect, useRef } from "react";
import { site } from "../../data";
import SectionTitle from "../ui/SectionTitle";
import Icon from "../ui/Icon";
export default function Automation() {
  const d = site.automation;
  const graph = useRef<HTMLDivElement>(null);
  const positions = [[130,65],[440,65],[520,245],[290,385],[60,245]];
  const paths = ["M130 110 C130 145 260 125 260 160", "M440 110 C440 145 320 125 320 160", "M473 245 C425 245 410 230 360 230", "M290 340 C290 330 290 315 290 300", "M107 245 C155 245 170 230 220 230"];
  useEffect(() => {
    const host = graph.current;
    if (!host) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const wires = [...host.querySelectorAll<SVGPathElement>(".flow-wire")];
    const dots = [...host.querySelectorAll<SVGCircleElement>(".flow-particle")];
    const core = host.querySelector<HTMLElement>(".flow-core")!;
    let frame = 0, visible = false, previous = 0, elapsed = 0;
    const received = paths.map(() => -1);
    let pulse: Animation | undefined;
    const draw = (now: number) => {
      if (!visible || document.hidden || reduced.matches) { frame = 0; previous = 0; return; }
      if (previous) elapsed += Math.min(now - previous, 100) / 1000;
      previous = now;
      wires.forEach((wire, i) => {
        const duration = site.visuals.automation.durations[i];
        const cycle = duration + site.visuals.automation.pause;
        const phase = Math.max(0,elapsed-i*.4);
        const round = Math.floor(phase/cycle), local = phase%cycle;
        const point = wire.getPointAtLength(wire.getTotalLength()*Math.min(1,local/duration));
        dots[i].setAttribute("cx",String(point.x)); dots[i].setAttribute("cy",String(point.y));
        dots[i].style.opacity = local < duration ? "1" : "0";
        if (local >= duration && received[i] !== round) {
          received[i] = round;
          pulse?.cancel();
          pulse = core.animate([{filter:"brightness(1)",transform:"scale(1)"},{filter:"brightness(2)",transform:"scale(1.045)",offset:.2},{filter:"brightness(1)",transform:"scale(1)"}],{duration:520,easing:"ease-out"});
        }
      });
      frame = requestAnimationFrame(draw);
    };
    const sync = () => { cancelAnimationFrame(frame); previous = 0; if (visible && !document.hidden && !reduced.matches) frame=requestAnimationFrame(draw); dots.forEach(dot => dot.style.opacity = reduced.matches ? "0" : "1"); if(reduced.matches) pulse?.cancel(); };
    const observer = new IntersectionObserver(([e]) => { visible=e.isIntersecting; sync(); });
    observer.observe(host); reduced.addEventListener("change",sync); document.addEventListener("visibilitychange",sync);
    return () => { cancelAnimationFrame(frame); pulse?.cancel(); observer.disconnect(); reduced.removeEventListener("change",sync); document.removeEventListener("visibilitychange",sync); };
  }, []);
  return (
    <section id="automacao" className="section automation">
      <TerrainSides />
      <div className="container automation-layout">
        <div>
          <SectionTitle {...d} />
          <div className="benefit-list">
            {d.benefits.map((x) => (
              <div key={x.title} data-reveal>
                <Icon name={x.icon} />
                <div>
                  <h3>{x.title}</h3>
                  <p>{x.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="automation-art" data-reveal ref={graph}>
          <svg
            className="flow-lines"
            viewBox="0 0 580 460"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="lineGreen" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="580" y2="460">
                <stop stopColor="#a3ff3f" />
                <stop offset="1" stopColor="#a3ff3f" stopOpacity=".15" />
              </linearGradient>
            </defs>
            {paths.map((path, i) => (
              <g key={i}>
                <path className="flow-wire" d={path} stroke="url(#lineGreen)" strokeWidth="1.3" />
                <circle className="flow-particle" r="3" fill="#a3ff3f" opacity="0" />
              </g>
            ))}
          </svg>
          <div className="flow-core-anchor"><div className="flow-core">
            <Brain className="flow-ai-icon" size={48} strokeWidth={1.5} aria-hidden="true" />
            <strong>IA</strong><span>{d.centerLabel}</span>
          </div></div>
          {d.nodes.map((n, i) => (
            <div className="flow-node-anchor" key={n} style={{left:`${positions[i][0]/580*100}%`,top:`${positions[i][1]/460*100}%`}}>
              <div className="flow-node">
                <Icon name={["message", "calendar", "database", "cloud", "dashboard"][i]} size={25} />
                <span>{n}</span><i />
              </div>
            </div>
          ))}
          <div className="flow-orbit" />
          <span className="flow-note mono">
            <i className="status-dot" />
            SISTEMAS DIFERENTES. UMA SÓ DIREÇÃO.
          </span>
        </div>
      </div>
    </section>
  );
}
