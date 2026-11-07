import { useCallback } from "react";
import { ArrowUpRight, Check, ArrowRight } from "lucide-react";
import { site } from "../../data";
import GlassModal from "./GlassModal";
import Icon from "../ui/Icon";
type Solution = (typeof site.solutions.items)[number];
export default function SolutionModal({
  solution,
  index,
  onClose,
}: {
  solution: Solution;
  index: number;
  onClose: () => void;
}) {
  const close = useCallback(onClose, [onClose]);
  const labels = site.solutions.modal;
  const examples = site.projects.filter((p) =>
    solution.examples.includes(p.id),
  );
  return (
    <GlassModal id="solution-modal" title={solution.title} onClose={close}>
      <div className="solution-modal-hero">
        <div className="modal-hero-grid" />
        <div className="modal-orbit orbit-a" />
        <div className="modal-orbit orbit-b" />
        <div className="modal-hero-icon">
          <Icon name={solution.icon} size={95} />
        </div>
        <span className="eyebrow">
          0{index + 1} / {labels.eyebrow}
        </span>
        <h2 id="solution-modal-title">{solution.title}</h2>
        <p>{solution.detail}</p>
        <div className="tags">
          {solution.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
      <div className="modal-body">
        <div className="modal-two-columns">
          <div>
            <span className="eyebrow">01 / POSSIBILIDADES</span>
            <h3>{labels.deliverablesTitle}</h3>
            <ul className="modal-checklist">
              {solution.deliverables.map((t) => (
                <li key={t}>
                  <Check size={17} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="eyebrow">02 / CONTEXTO</span>
            <h3>{labels.bestForTitle}</h3>
            <ul className="modal-checklist">
              {solution.bestFor.map((t) => (
                <li key={t}>
                  <ArrowRight size={16} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="modal-approach">
          <span className="eyebrow">03 / DIREÇÃO</span>
          <h3>{labels.approachTitle}</h3>
          <p>{solution.approach}</p>
          <div className="modal-process">
            {site.process.steps.map((step, i) => (
              <div key={step.name}>
                <span className="mono">0{i + 1}</span>
                <Icon name={step.icon} size={21} />
                <span>{step.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-projects">
          <div className="modal-projects-heading">
            <span className="eyebrow">04 / NA PRÁTICA</span>
            <h3>{labels.examplesTitle}</h3>
          </div>
          <div className="modal-examples">
            {examples.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="modal-example"
              >
                <div className={`modal-example-image fit-${p.imageFit}`}>
                  <img
                    src={p.image}
                    alt={p.imageAlt}
                    loading="lazy"
                    width="800"
                    height="500"
                  />
                </div>
                <div>
                  <span>
                    <strong>{p.name}</strong>
                    <small>{p.kind}</small>
                  </span>
                  <ArrowUpRight size={20} />
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="modal-end">
          <p>{labels.scopeNote}</p>
          <a className="button" href="#contato" onClick={onClose}>
            {labels.cta}
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </GlassModal>
  );
}
