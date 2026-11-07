import { site } from "../../data";
import SectionTitle from "../ui/SectionTitle";
import Icon from "../ui/Icon";
import LavaImage from "../ui/LavaImage";
export default function About() {
  const d = site.about;
  return (
    <section id="sobre" className="section about">
      <div className="container about-layout">
        <div className="about-copy">
          <SectionTitle {...d} />
          <div className="pillars">
            {d.pillars.map((x, i) => (
              <article key={x.title} data-reveal>
                <div className="pillar-top">
                  <Icon name={x.icon} />
                  <span>0{i + 1}</span>
                </div>
                <h3>{x.title}</h3>
                <p>{x.description}</p>
              </article>
            ))}
          </div>
          <blockquote data-reveal>
            <span>//</span>
            {d.quote}
          </blockquote>
        </div>
      </div>
      <LavaImage variant="right" className="about-edge-mountain" />
      <LavaImage variant="about" className="about-edge-raccoon" />
    </section>
  );
}
