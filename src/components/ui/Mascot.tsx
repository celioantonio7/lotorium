import { useEffect, useRef, useState } from "react";
import { site } from "../../data";
export default function Mascot({className="",priority=false,blink=false}:{className?:string;priority?:boolean;blink?:boolean}) {
 const ref=useRef<HTMLDivElement>(null);
 const [closed,setClosed]=useState(false),[loaded,setLoaded]=useState(false);
 useEffect(()=>{
  if(!blink||!loaded||!site.effects.blink.enabled)return;
  const host=ref.current;if(!host)return;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");let visible=false;
  let timer:ReturnType<typeof setInterval>|undefined,release:ReturnType<typeof setTimeout>|undefined;
  const stop=()=>{clearInterval(timer);clearTimeout(release);setClosed(false);};
  const sync=()=>{stop();if(visible&&!document.hidden&&!reduced.matches)timer=setInterval(()=>{setClosed(true);release=setTimeout(()=>setClosed(false),site.effects.blink.durationMs);},site.effects.blink.intervalMs);};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(host);
  reduced.addEventListener("change",sync);document.addEventListener("visibilitychange",sync);
  return()=>{clearInterval(timer);clearTimeout(release);observer.disconnect();reduced.removeEventListener("change",sync);document.removeEventListener("visibilitychange",sync);};
 },[blink,loaded]);
 const image=<img className={blink?"mascot-open":`mascot ${className}`} src={site.brand.mascot} alt="Guaxinim da Lotorium com detalhes em verde-limão" width="1536" height="1024" loading={priority?"eager":"lazy"} fetchPriority={priority?"high":"auto"} decoding="async" />;
 if(!blink)return image;
 return <div ref={ref} className={`mascot blink-mascot ${closed?"is-blinking":""} ${className}`} data-blink-state={closed?"closed":"open"}>{image}<img className="mascot-closed-eyes" src={site.effects.blink.closedImage} width="1536" height="1024" alt="" aria-hidden="true" onLoad={()=>setLoaded(true)} /></div>;
}
