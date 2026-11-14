import { useRef, useState } from "react";
import { useSynchronizedBlink } from "../../hooks/useSynchronizedBlink";
import { site } from "../../data";
export default function Mascot({className="",priority=false,blink=false}:{className?:string;priority?:boolean;blink?:boolean}) {
 const ref=useRef<HTMLDivElement>(null);
 const [loaded,setLoaded]=useState(false);
 const closed=useSynchronizedBlink(ref,blink && loaded);
 const image=<img className={blink?"mascot-open":`mascot ${className}`} src={site.brand.mascot} alt="Guaxinim da Lotorium com detalhes em verde-limão" width="1536" height="1024" loading={priority?"eager":"lazy"} fetchPriority={priority?"high":"auto"} decoding="async" />;
 if(!blink)return image;
 return <div ref={ref} className={`mascot blink-mascot ${closed?"is-blinking":""} ${className}`} data-blink-state={closed?"closed":"open"}>{image}<img className="mascot-closed-eyes" src={site.effects.blink.closedImage} width="1536" height="1024" alt="" aria-hidden="true" loading="lazy" decoding="async" onLoad={()=>setLoaded(true)} /></div>;
}
