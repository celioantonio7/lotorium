import TerrainSides from "../ui/TerrainSides";
import { site } from "../../data";
import SectionTitle from "../ui/SectionTitle";
import Icon from "../ui/Icon";
import Mascot from "../ui/Mascot";
export default function Differences() {
  const d = site.differences;
  return (
    <section id="diferenciais" className="section differences">
      <TerrainSides />
      <div className="container">
        <SectionTitle {...d} />
        <div className="differences-content">
          <div className="differences-grid">
            {d.items.map((x, i) => (
              <article data-reveal key={x.title}>
                <div className="difference-number mono">
                  0{i + 1}
                  <Icon name={x.icon} size={22} />
                </div>
                <h3>{x.title}</h3>
                <p>{x.description}</p>
              </article>
            ))}
          </div>
          <div className="difference-art" aria-hidden="true">
            <div className="difference-ring" />
            <Mascot />
            <span className="mono">O OLHAR MUDA TUDO.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
