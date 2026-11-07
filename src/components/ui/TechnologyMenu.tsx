import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const groups = [
  { title: "Interfaces & experiências", tools: [["React", "react"], ["TypeScript", "typescript"], ["JavaScript", "javascript"], ["Tailwind CSS", "tailwindcss"], ["Figma", "figma"]] },
  { title: "Sistemas & integrações", tools: [["Node.js", "nodejs"], ["Supabase", "supabase"], ["PostgreSQL", "postgresql"], ["Python", "python"]] },
  { title: "Produtos & infraestrutura", tools: [["Electron", "electron"], ["Android", "android"], ["Docker", "docker"], ["Git", "git"], ["Vite", "vitejs"]] },
];

export default function TechnologyMenu() {
  const [open, setOpen] = useState<number | null>(null);
  return <div className="technology-menu" aria-label="Tecnologias que utilizamos">
    {groups.map((group, i) => <button type="button" key={group.title} className={`technology-row ${open === i ? "is-open" : ""}`} aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
      <span className="technology-label">{group.title}<ArrowUpRight aria-hidden="true" /></span>
      <span className="technology-marquee"><span className="technology-track">
        {[0, 1, 2, 3].map(copy => <span className="technology-part" key={copy} aria-hidden={copy > 0}>{group.tools.map(([name, icon]) => <span className="technology-tool" key={name}><img src={`/images/technologies/${icon}.svg`} alt="" width="40" height="40" /><span>{name}</span></span>)}</span>)}
      </span></span>
    </button>)}
  </div>;
}
