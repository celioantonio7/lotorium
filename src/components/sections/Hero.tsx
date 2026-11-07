import TerrainSides from "../ui/TerrainSides";
import ShaderBackground from "../animations/ShaderBackground";
import {
  ArrowDown,
  Code2,
  Workflow,
  BrainCircuit,
  PenTool,
  Globe,
} from "lucide-react";
import { site } from "../../data";
import Button from "../ui/Button";
import Mascot from "../ui/Mascot";
const icons = [Code2, Workflow, BrainCircuit, PenTool, Globe];
export default function Hero() {
  const d = site.hero;
  return (
    <section id="inicio" className="hero">
      <div className="hero-underlay" aria-hidden="true">
        <div className="hero-kinetic kinetic-first">{site.effects.heroTransition.marquee.repeat(4)}</div>
        <div className="hero-kinetic kinetic-second">{site.effects.heroTransition.marquee.repeat(4)}</div>
      </div>
      <div className="hero-scene">
      <ShaderBackground />
      <TerrainSides />
      <div className="hero-orbit" aria-hidden="true" />
      <div className="hero-coordinate" aria-hidden="true">
        LT® / NEXT IS NOW
      </div>
      <div className="container hero-layout">
        <div className="hero-copy">
          <span className="eyebrow hero-reveal">
            <i className="status-dot" />
            {d.eyebrow}
          </span>
          <h1>
            {d.title.map((line) => (
              <span className="hero-line" key={line}>
                <span>{line}</span>
              </span>
            ))}
            <span className="hero-line">
              <em className="next-highlight" data-text={d.highlight}>{d.highlight}</em>
            </span>
          </h1>
          <p className="hero-description hero-reveal">{d.description}</p>
          <div className="hero-actions hero-reveal">
            <Button href="#contato">{d.primaryCta}</Button>
            <a className="text-link" href="#solucoes">
              {d.secondaryCta}
              <ArrowDown size={16} />
            </a>
          </div>
          <div className="capabilities hero-reveal">
            {d.categories.map((x, i) => {
              const I = icons[i];
              return (
                <span key={x} tabIndex={0} className="technology-chip">
                  <I size={19} strokeWidth={1.4} />
                  {x}
                  <span className="technology-hint" role="tooltip">{d.technologyHints[i]}</span>
                </span>
              );
            })}
          </div>
        </div>
        <div className="hero-art">
          <div className="art-ring ring-one" />
          <div className="art-ring ring-two" />
          <Mascot priority blink />
          <div className="art-caption">
            <span className="crosshair">+</span> CURIOSIDADE É O NOSSO INSTINTO.
          </div>
        </div>
      </div>
      <div className="hero-bottom container">
        <a href="#sobre" className="scroll-cue">
          <span>
            <ArrowDown size={15} />
          </span>
          EXPLORE O PRÓXIMO
        </a>
        <span>{d.footnote}</span>
        <span className="hero-index">01 — 09</span>
      </div>
      <div className="hero-scene-dim" aria-hidden="true" />
      </div>
      <div className="hero-signature" aria-hidden="true">
        <span className="hero-signature-word">{site.effects.heroTransition.signature}</span>
        <svg viewBox="0 0 600 80" fill="none"><path d="M20 55 C130 2 420 7 580 28 C430 42 180 46 92 66" /></svg>
        <span className="mono hero-signature-caption">{site.effects.heroTransition.caption}</span>
      </div>
    </section>
  );
}
