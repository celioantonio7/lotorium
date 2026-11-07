import DeviceShowcase from "../ui/DeviceShowcase";
import Icon from "../ui/Icon";
import TerrainSides from "../ui/TerrainSides";
import { useCallback, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { site } from "../../data";
import SectionTitle from "../ui/SectionTitle";
import ProjectModal from "../modals/ProjectModal";
type Project = (typeof site.projects)[number];
export default function WebDesign() {
  const d = site.web;
  const featured =
    site.projects.find((p) => p.id === d.featuredProjectId) ?? site.projects[0];
  const [selected, setSelected] = useState<Project | null>(null);
  const close = useCallback(() => setSelected(null), []);
  return (
    <>
      <section id="web-design" className="section web-design">
      <TerrainSides />
        <div className="container">
          <div className="web-layout">
            <TerrainSides />
            <div className="web-energy-arc" aria-hidden="true" />
            <div>
              <SectionTitle {...d} />
              <div className="web-benefits">
                {d.benefits.map((x) => (
                  <div key={x.title} data-reveal>
                    <Icon name={x.icon} size={22} />
                    <div>
                      <h3>{x.title}</h3>
                      <p>{x.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="web-actions">
                <a className="button" href="#projetos">Explorar projetos <ArrowUpRight size={18} /></a>
                <button className="web-case-button" onClick={() => setSelected(featured)}><Play size={15} /> Ver case em destaque</button>
              </div>
            </div>
            <DeviceShowcase project={featured} onExplore={() => setSelected(featured)} />
          </div>
          <div className="projects-gallery" id="projetos">
            <div className="gallery-heading" data-reveal>
              <span className="eyebrow">{d.galleryLabel}</span>
              <h3>{d.galleryTitle}</h3>
              <p>{d.galleryDescription}</p>
            </div>
            <div className="projects-grid">
              {site.projects
                .filter((p) => p.id !== featured.id)
                .map((p, i) => (
                  <button
                    className="portfolio-card"
                    key={p.id}
                    data-reveal
                    onClick={() => setSelected(p)}
                    aria-label={`Explorar projeto ${p.name}`}
                  >
                    <div className={`portfolio-image fit-${p.imageFit}`}>
                      <img
                        src={p.image}
                        alt={p.imageAlt}
                        loading="lazy"
                        width="800"
                        height="500"
                      />
                      <span className="portfolio-open">
                        <ArrowUpRight size={25} />
                      </span>
                      <span className="portfolio-index mono">0{i + 1}</span>
                    </div>
                    <div className="portfolio-caption">
                      <div>
                        <span className="mono">{p.category}</span>
                        <h4>{p.name}</h4>
                      </div>
                      <ArrowUpRight size={20} />
                    </div>
                    <div className="portfolio-tags">
                      {p.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </section>
      {selected && <ProjectModal project={selected} onClose={close} />}
    </>
  );
}
