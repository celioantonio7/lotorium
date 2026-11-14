import { useEffect, useState } from "react";
import TechText from "../ui/TechText";
import LavaImage from "../ui/LavaImage";
import { site } from "../../data";
import { ArrowUp, ArrowUpRight, MoveUpRight } from "lucide-react";
export default function Footer() {
  const [reduced, setReduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const wordmark = site.effects.footerWordmark.replace(/^l/i, "L");
  return (
    <footer className="footer footer-v2" id="footer">
      <LavaImage variant="left" className="footer-mountain footer-mountain-left" />
      <LavaImage variant="right" className="footer-mountain footer-mountain-right" />
      <div className="footer-reveal">
        <div className="container">
          <div className="footer-intro">
            <span className="eyebrow">
              <i className="status-dot" />
              {site.ui.footerEyebrow}
            </span>
            <a href="#contato" className="footer-big-cta">
              <span>{site.ui.footerTitle}</span>
              <span className="footer-cta-arrow">
                <MoveUpRight strokeWidth={1} size={70} />
              </span>
            </a>
          </div>
          <div className="footer-directory">
            <div className="footer-statement">
              <img
                src={site.brand.symbol}
                width="62"
                height="62"
                alt="Símbolo da Lotorium"
              />
              <p>{site.brand.tagline}</p>
              <span className="mono">{site.ui.footerSignature}</span>
            </div>
            <nav aria-label="Navegação do rodapé">
              <span className="mono">{site.ui.footerNavigationLabel}</span>
              {site.navigation.map((x) => (
                <a href={x.href} key={x.href}>
                  {x.label}
                  <ArrowUpRight size={13} />
                </a>
              ))}
            </nav>
            <nav aria-label="Produtos Lotorium">
              <span className="mono">{site.ui.footerProductsLabel}</span>
              {site.products.items.map((x) => (
                <a
                  href={x.url}
                  key={x.name}
                  {...(x.url.startsWith("https://")
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  {x.name}
                  <ArrowUpRight size={13} />
                </a>
              ))}
            </nav>
            <div className="footer-connect">
              <span className="mono">{site.ui.footerServicesLabel}</span>
              {site.solutions.items.slice(0, 3).map((x) => (
                <a href="#solucoes" key={x.title}>
                  {x.title}
                </a>
              ))}
              <a href="#contato" className="footer-contact-link">
                {site.ui.footerCta}
                <ArrowUpRight size={15} />
              </a>
              {(site.footer.socials as { label: string; url: string }[]).map(
                (x) => (
                  <a href={x.url} key={x.url} target="_blank" rel="noreferrer">
                    {x.label}
                    <ArrowUpRight size={13} />
                  </a>
                ),
              )}
            </div>
          </div>
          <div className="footer-wordmark footer-tech-stage">
            {reduced ? <span className="footer-tech-static">{wordmark}</span> : (
              <TechText text={wordmark} fontFamily="Manrope, sans-serif" fontWeight={800} fontSize={280}
                letterSpacing={-.065} color="#a3ff3f" accentColor="#d7ffa8" reveal="letter"
                dashLength={4} dashGap={2} specks={site.effects.footerTechText.specks} intro="none"
                reach={site.effects.footerTechText.reach} clickKick={site.effects.footerTechText.clickKick}
                draggable={site.effects.footerTechText.draggable} sweep={site.effects.footerTechText.sweep}
                speed={site.effects.footerTechText.speed} guides={false} />
            )}
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} {site.footer.copyright}
            </span>
            <span className="mono">{site.ui.footerLocation}</span>
            <a href="#inicio" className="footer-back-top">
              {site.ui.footerBackTop}
              <span>
                <ArrowUp size={16} />
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
