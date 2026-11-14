import { useRef, useState } from "react";
import { useSynchronizedBlink } from "../../hooks/useSynchronizedBlink";
import LavaImage from "./LavaImage";

export default function AboutMascot() {
  const ref=useRef<HTMLDivElement>(null);
  const [ready,setReady]=useState(false);
  const closed=useSynchronizedBlink(ref,ready);
  return <div ref={ref} className="about-edge-raccoon about-blink" data-blink-state={closed?"closed":"open"} aria-hidden="true">
    <LavaImage variant="about" />
    <img className="about-closed-eyes" src="./assets/lotorium/about-raccoon-closed-v2.webp" width="1086" height="1448" loading="lazy" decoding="async" alt="" onLoad={()=>setReady(true)} />
  </div>;
}
