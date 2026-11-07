import TerrainSides from "../ui/TerrainSides";
import { useCallback, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import SolutionModal from "../modals/SolutionModal";
import { site } from "../../data";
import SectionTitle from "../ui/SectionTitle";
import Icon from "../ui/Icon";
export default function Solutions() {
  const d = site.solutions;
  const [active, setActive] = useState<number | null>(null);
  const closeModal = useCallback(() => setActive(null), []);
  return (
    <>
      <section id="solucoes" className="section solutions">
      <TerrainSides />
        <div className="container">
          <div className="heading-row">
            <SectionTitle {...d} />
            <span className="section-aside mono" data-reveal>
              ESTRATÉGIA + DESIGN + ENGENHARIA
              <br />
              DO ZERO AO QUE VEM DEPOIS.
            </span>
          </div>
          <div className="solutions-grid">
            {d.items.map((x, i) => (
              <article
                className={`solution-card solution-${i} ${active === i ? "expanded" : ""}`}
                data-reveal
                key={x.title}
              >
                <div className="card-top">
                  <span className="mono">0{i + 1}</span>
                  <Icon name={x.icon} size={29} />
                </div>
                <div
                  className={`solution-graphic graphic-${i}`}
                  aria-hidden="true"
                >
                  {i === 0 ? (
                    <>
                      <span>&lt;</span>
                      <i />
                      <span>/&gt;</span>
                    </>
                  ) : i === 1 ? (
                    <>
                      <i />
                      <i />
                      <i />
                    </>
                  ) : i === 2 ? (
                    <>
                      <b />
                      <i />
                      <b />
                    </>
                  ) : i === 3 ? (
                    <>
                      <div className="mini-browser">
                        <span>● ● ●</span>
                        <i />
                        <b />
                        <b />
                      </div>
                    </>
                  ) : (
                    <>
                      <i />
                      <i />
                      <span>Aa</span>
                    </>
                  )}
                </div>
                <div className="solution-content">
                  <div className="tags">
                    {x.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <h3>{x.title}</h3>
                  <p>{x.description}</p>
                  <button
                    className="solution-toggle"
                    aria-haspopup="dialog"
                    onClick={() => setActive(i)}
                  >
                    <span>Explorar solução</span>
                    <ArrowUpRight size={19} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      {active !== null && (
        <SolutionModal
          solution={d.items[active]}
          index={active}
          onClose={closeModal}
        />
      )}
    </>
  );
}
