import { useEffect, type RefObject } from "react";

export function useLandscapeParallax(section: RefObject<HTMLElement | null>, scene: RefObject<HTMLDivElement | null>, background: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const host=section.current, art=scene.current, back=background.current;
    if(!host || !art || !back) return;
    const reduced=matchMedia("(prefers-reduced-motion: reduce)");
    const fine=matchMedia("(hover: hover) and (pointer: fine)");
    let visible=false, frame=0, last=0, x=0, y=0, vx=0, vy=0, tx=0, ty=0;
    const draw=(now:number)=>{
      frame=0;
      if(!visible || document.hidden || reduced.matches) return;
      const dt=last?Math.min((now-last)/1000,.032):1/60; last=now;
      // A damped spring keeps pointer changes interruptible without React renders.
      vx+=(100*(tx-x)-20*vx)*dt; vy+=(100*(ty-y)-20*vy)*dt;
      x+=vx*dt;y+=vy*dt;
      art.style.transform=`translate3d(${x}px,${y}px,0)`;
      back.style.transform=`translate3d(${-x*.6}px,${-y*.7}px,0)`;
      if(Math.abs(tx-x)+Math.abs(ty-y)+Math.abs(vx)+Math.abs(vy)>.02) frame=requestAnimationFrame(draw);
      else last=0;
    };
    const wake=()=>{if(!frame && visible && !document.hidden && !reduced.matches)frame=requestAnimationFrame(draw);};
    const pointer=(event:PointerEvent)=>{
      if(!fine.matches) return;
      const r=host.getBoundingClientRect();
      tx=((event.clientX-r.left)/r.width-.5)*12;
      ty=((event.clientY-r.top)/r.height-.5)*6;wake();
    };
    const leave=()=>{tx=0;ty=0;wake();};
    const scroll=()=>{
      if(!visible) return;
      const r=host.getBoundingClientRect();
      ty=Math.max(-6,Math.min(6,(innerHeight*.5-r.top-r.height*.5)*.012));wake();
    };
    const sync=()=>{
      cancelAnimationFrame(frame);frame=0;last=0;
      if(reduced.matches){art.style.transform="";back.style.transform="";x=y=vx=vy=tx=ty=0;}
      else wake();
    };
    const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync();});io.observe(host);
    host.addEventListener("pointermove",pointer,{passive:true});host.addEventListener("pointerleave",leave);
    window.addEventListener("scroll",scroll,{passive:true});document.addEventListener("visibilitychange",sync);reduced.addEventListener("change",sync);
    return()=>{cancelAnimationFrame(frame);io.disconnect();host.removeEventListener("pointermove",pointer);host.removeEventListener("pointerleave",leave);window.removeEventListener("scroll",scroll);document.removeEventListener("visibilitychange",sync);reduced.removeEventListener("change",sync);art.style.transform="";back.style.transform="";};
  },[section,scene,background]);
}
