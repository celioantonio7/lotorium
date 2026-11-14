import { useRef } from "react";
import LandscapeAtmosphere from "../animations/LandscapeAtmosphere";
import AboutMascot from "../ui/AboutMascot";
import { useLandscapeParallax } from "../../hooks/useLandscapeParallax";
import { site } from "../../data";
import SectionTitle from "../ui/SectionTitle";
import Icon from "../ui/Icon";
import LavaImage from "../ui/LavaImage";
export default function About() {
  const d = site.about;
  const section=useRef<HTMLElement>(null), scene=useRef<HTMLDivElement>(null), background=useRef<HTMLDivElement>(null);
  useLandscapeParallax(section,scene,background);
  return (
    <section ref={section} id="sobre" className="section about">
      <div ref={background} className="about-background-layer" aria-hidden="true">
        <img className="about-background" src="./assets/lotorium/about-landscape.webp" width="1672" height="941" alt="" loading="lazy" decoding="async" />
      </div>
      <LandscapeAtmosphere />
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
      <div ref={scene} className="about-scene" aria-hidden="true">
        <LavaImage variant="aboutRocks" className="about-edge-mountain" />
        <span className="about-contact about-contact-foot" />
        <span className="about-contact about-contact-hand" />
        <AboutMascot />
      </div>
    </section>
  );
}
