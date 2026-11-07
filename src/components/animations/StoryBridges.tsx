import { ArrowUpRight } from "lucide-react";
import MatrixRain from "./MatrixRain";
import TechnologyMenu from "../ui/TechnologyMenu";
import { site } from "../../data";
export function ArcBridge() {
 const d=site.storyTransitions.arc;
 const finance=site.products.items.find(p=>p.name==="HappyCash Finance")!;
 const previews=[...site.projects,{id:"happycash-finance-preview",name:finance.name,category:finance.category,image:finance.image,imageFit:finance.imageFit}];
 return <div className="story-arc" aria-label="Da descoberta à entrega">
   <MatrixRain />
   <div className="arc-project-stack" aria-hidden="true">
    {previews.map((project,i)=><div className="arc-preview-card" key={project.id} style={{"--preview-index":i} as React.CSSProperties}><span className="mono">0{i+1} / {project.category}</span><img src={project.image} alt="" loading="lazy" style={{objectFit:project.imageFit === "contain" ? "contain" : "cover"}}/><strong>{project.name}</strong></div>)}
   </div>
   <svg className="story-arc-svg" viewBox="0 0 3000 1600" aria-hidden="true">
     <defs><path id="lotorium-word-arc" d="M400 1450 C400 842 892 350 1500 350 C2108 350 2600 842 2600 1450" /></defs>
     {d.words.split("•").map(word=>word.trim()).filter(Boolean).map((word,i,words)=><text key={word}><textPath href="#lotorium-word-arc" startOffset={`${10+i*80/(words.length-1)}%`} textAnchor="middle">{word}</textPath></text>)}
   </svg>
 </div>;
}
export function CurveBridge() {
 const d=site.storyTransitions.curve;
 return <div className="story-curve">
  <svg className="story-curve-line" viewBox="0 0 1400 900" preserveAspectRatio="none" aria-hidden="true"><path className="story-curve-draw" d="M160 -180 C160 180 190 420 540 560" /></svg>
  <div className="curve-window">
   <div className="curve-window-content">
    <h2>“{d.quote}”</h2>
    <p className="curve-signature">{d.signature}</p>
    <TechnologyMenu />
    <div className="curve-rows">{d.rows.map((row,i)=><a href={row.href} key={row.href} className={i===0?"curve-cta":"curve-row"}>{row.label}<ArrowUpRight size={18}/></a>)}</div>
    <div className="curve-ticker" aria-hidden="true"><span>{d.ticker.repeat(4)}</span></div>
   </div>
  </div>
 </div>;
}
