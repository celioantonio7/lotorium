import LavaImage from "../ui/LavaImage";
import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import { site } from "../../data";
import SectionTitle from "../ui/SectionTitle";
import Icon from "../ui/Icon";
export default function Process() {
  const d = site.process;
  const [active, setActive] = useState(0);
  useEffect(() => {
    const update = (e: Event) => setActive((e as CustomEvent<number>).detail);
    window.addEventListener("lotorium:process-step", update);
    return () => window.removeEventListener("lotorium:process-step", update);
  }, []);
  return (
    <section id="processo" className="section process">
      <LavaImage variant="right" className="process-ground-mountain" />

      <div className="container process-stage">
        <div className="heading-row">
          <SectionTitle {...d} />
          <div className="process-scroll-instruction">
            <ArrowDown size={17} />
            <span className="mono">{site.ui.processScrollLabel}</span>
          </div>
        </div>
        <div className="process-timeline">
          <svg
            className="timeline-curve"
            viewBox="0 0 1200 240"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="process-track"
              d="M25 212 C130 212 170 182 271 182 S420 156 517 156 S670 119 763 119 S915 62 1009 62"
              stroke="#29332a"
            />
            <path
              className="process-progress-glow"
              d="M25 212 C130 212 170 182 271 182 S420 156 517 156 S670 119 763 119 S915 62 1009 62"
              stroke="#a3ff3f"
              strokeWidth="7"
            />
            <path
              className="process-progress-path"
              d="M25 212 C130 212 170 182 271 182 S420 156 517 156 S670 119 763 119 S915 62 1009 62"
              stroke="#a3ff3f"
              strokeWidth="1.7"
            />
          </svg>
          {d.steps.map((x, i) => (
            <article
              className={`process-step step-${i} ${i === active ? "is-active" : ""} ${i < active ? "is-complete" : ""}`}
              key={x.name}
              style={{ "--process-index": i } as React.CSSProperties}
              aria-current={i === active ? "step" : undefined}
            >
              <div className="process-card-glint" aria-hidden="true" />
              <div className="step-icon">
                <span className="step-ring" />
                <Icon name={x.icon} size={25} />
                <span className="step-flare" />
              </div>
              <span className="mono">0{i + 1}</span>
              <h3>{x.name}</h3>
              <h4>{x.title}</h4>
              <p>{x.description}</p>
              <span className="step-beacon" aria-hidden="true" />
            </article>
          ))}
        </div>
        <div className="process-mobile-layout">
          <svg
            className="process-mobile-svg"
            viewBox="0 0 50 300"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path d="M25 0L25 300" stroke="#29332a" />
            <path
              className="process-progress-glow"
              d="M25 0L25 300"
              stroke="#a3ff3f"
              strokeWidth="6"
            />
            <path
              className="process-progress-path"
              d="M25 0L25 300"
              stroke="#a3ff3f"
              strokeWidth="1.5"
            />
          </svg>
          <div className="process-mobile-rail">
            {d.steps.map((x, i) => (
              <div
                className={`process-mobile-node ${i === active ? "is-active" : ""} ${i < active ? "is-complete" : ""}`}
                style={{ "--step": i } as React.CSSProperties}
                key={x.name}
              >
                <Icon name={x.icon} size={23} />
                <span className="mono">0{i + 1}</span>
              </div>
            ))}
          </div>
          <div className="process-mobile-cards">
            {d.steps.map((x, i) => (
              <article
                key={x.name}
                className={`process-mobile-card ${i === active ? "is-active" : ""}`}
                aria-hidden={i !== active}
              >
                <span className="eyebrow">
                  {site.ui.processStageLabel} 0{i + 1} / 05
                </span>
                <Icon name={x.icon} size={55} />
                <h3>{x.name}</h3>
                <h4>{x.title}</h4>
                <p>{x.description}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="process-bottom">
          <div className="process-current">
            <span className="mono">0{active + 1} / 05</span>
            <strong>{d.steps[active].name}</strong>
          </div>
          <div className="process-scroll-track">
            <span className="process-scroll-fill" />
          </div>
          <span className="mono process-complete-label">
            {site.ui.processCompleteLabel}
          </span>
        </div>
      </div>
    </section>
  );
}
