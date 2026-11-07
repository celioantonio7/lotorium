import TerrainSides from "../ui/TerrainSides";
import { site } from "../../data";
import SectionTitle from "../ui/SectionTitle";
import ProductPreview from "../ui/ProductPreview";
import { ArrowUpRight } from "lucide-react";
export default function Products() {
  const d = site.products;
  return (
    <section id="produtos" className="section products">
      <TerrainSides />
      <div className="container">
        <SectionTitle {...d} />
        <div className="product-grid">
          {d.items.map((x, i) => (
            <article
              className="product-card"
              key={x.name}
              style={{ "--product-accent": x.accent } as React.CSSProperties}
              data-reveal
            >
              <div className="product-meta">
                <span className="mono">{x.category}</span>
                <span className="mono">0{i + 1}</span>
              </div>
              <h3>{x.name}</h3>
              <p>{x.description}</p>
              <div className={`product-image product-fit-${x.imageFit}`}>
                {x.image ? (
                  <img
                    src={x.image}
                    alt={x.imageAlt}
                    loading="lazy"
                    width="680"
                    height="440"
                  />
                ) : (
                  <ProductPreview
                    variant={i}
                    name={x.name}
                    label={x.previewLabel}
                  />
                )}
              </div>
              <span className="product-visual-label mono">{x.visualLabel}</span>
              <div className="product-features">
                {x.features.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <a
                className="product-link"
                href={x.url}
                {...(x.url.startsWith("https://")
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                {x.cta}
                <span>
                  <ArrowUpRight size={18} />
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
