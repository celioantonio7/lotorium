import gsap from "gsap";
import { site } from "../../data";

/** Called inside the main GSAP context, before downstream scroll positions are measured. */
export function setupStoryTransitions() {
 const config=site.effects.heroTransition;
 const hero=document.querySelector<HTMLElement>(".hero");
 if(hero&&config.enabled){
  const line=hero.querySelector<SVGPathElement>(".hero-signature path");
  const length=line?.getTotalLength()??600;
  if(line)gsap.set(line,{strokeDasharray:length,strokeDashoffset:length});
  const tl=gsap.timeline({scrollTrigger:{id:"hero-story",trigger:hero,start:"top top",end:()=>`+=${innerHeight*(innerWidth<=800?config.mobileScrollScreens:config.scrollScreens)}`,pin:true,scrub:.7,invalidateOnRefresh:true,anticipatePin:1}});
  tl.fromTo(".hero-scene",{clipPath:"inset(0% 0% 0% 0% round 0px)",scale:1},{clipPath:()=>innerWidth<=800?"inset(10% 5% 10% 5% round 24px)":"inset(12% 21% 12% 21% round 32px)",scale:.94,duration:.65,ease:"none"},0)
   .to(".hero-copy",{yPercent:-15,autoAlpha:0,duration:.35,ease:"none"},0)
   .to(".hero-bottom",{autoAlpha:0,duration:.15},0)
   .to(".hero-scene-dim",{opacity:.78,duration:.65,ease:"none"},0)
   .to(".hero-art",{xPercent:()=>innerWidth<=800?-8:-15,scale:1.06,duration:.65,ease:"none"},0)
   .fromTo(".hero-signature",{autoAlpha:0,y:35},{autoAlpha:1,y:0,duration:.22,ease:"none"},.53)
   .fromTo(".hero-signature-word",{clipPath:"inset(0 100% 0 0)"},{clipPath:"inset(0 0% 0 0)",duration:.35,ease:"none"},.55)
   .to(".hero-signature path",{strokeDashoffset:0,duration:.3,ease:"none"},.66)
   .fromTo(".hero-signature-caption",{autoAlpha:0,y:10},{autoAlpha:1,y:0,duration:.15},.84)
   .to({}, {duration:.15});
  gsap.to(".kinetic-first",{xPercent:-12,ease:"none",scrollTrigger:{trigger:hero,start:"top top",end:"bottom top",scrub:1}});
  gsap.to(".kinetic-second",{xPercent:12,ease:"none",scrollTrigger:{trigger:hero,start:"top top",end:"bottom top",scrub:1}});
 }
 const arc=document.querySelector<HTMLElement>(".story-arc");
 if(arc){
  const chapter=arc.closest<HTMLElement>(".story-chapter")!;
  const products=chapter.querySelector<HTMLElement>(".products")!;
  const productContent=products.querySelector<HTMLElement>(":scope > .container")!;
  const viewportClip=()=>`inset(0px 0px ${Math.max(0,products.offsetHeight-innerHeight)}px 0px)`;
  gsap.set(products,{autoAlpha:0,scale:.22,y:()=>innerHeight*.39,transformOrigin:"50% 0%",clipPath:viewportClip});
  gsap.set(productContent,{autoAlpha:0});
  const cards=gsap.utils.toArray<HTMLElement>(".arc-preview-card");
  const rain=arc.querySelector<HTMLElement>(".arc-matrix")!;
  gsap.set(rain,{autoAlpha:0,"--rain-running":"paused"});
  const stack=arc.querySelector<HTMLElement>(".arc-project-stack")!;
  const cardX=(i:number)=>i*Math.max(0,stack.clientWidth-cards[0].offsetWidth)/Math.max(1,cards.length-1);
  const cardY=(i:number)=>i*Math.max(0,arc.clientHeight*.86-cards[0].offsetHeight)/Math.max(1,cards.length-1);
  const sequence=gsap.timeline({scrollTrigger:{id:"arc-story",trigger:chapter,start:"top top",end:()=>`+=${innerHeight*(cards.length*.7+7.2)}`,pin:true,scrub:.45,anticipatePin:1,invalidateOnRefresh:true}});
  cards.forEach((card,i)=>{
   gsap.set(card,{zIndex:i+1,x:()=>cardX(i),y:i ? innerHeight : 0});
   if(i) sequence.fromTo(card,{x:()=>cardX(i),y:()=>innerHeight,rotation:4},{x:()=>cardX(i),y:()=>cardY(i),rotation:0,duration:.7,ease:"none"},(i-1)*.75);
  });
  const wheelStart=(cards.length-1)*.75+.45;
  sequence.set(rain,{"--rain-running":"running"},wheelStart+.25)
   .to(rain,{autoAlpha:1,duration:.8,ease:"none"},wheelStart+.25)
   .to(rain,{autoAlpha:0,duration:1.1,ease:"none"},wheelStart+6.5)
   .set(rain,{"--rain-running":"paused"},wheelStart+7.65)
   .to(stack,{scale:.5,y:-80,autoAlpha:0,duration:.65,ease:"none"},wheelStart)
   .fromTo(".story-arc-svg",{rotation:72,autoAlpha:0},{rotation:72,autoAlpha:1,duration:.35,ease:"none",transformOrigin:"50% 90.625%"},wheelStart+.45)
   .to(".story-arc-svg",{rotation:-72,duration:3.6,ease:"none",transformOrigin:"50% 90.625%"},wheelStart+.95)
   .to(".story-arc-svg",{rotation:0,duration:1.4,ease:"none"},wheelStart+4.55)
   .to("#lotorium-word-arc",{attr:{d:"M1500 5500 C1500 4500 1500 3500 1500 2500 C1500 1500 1500 500 1500 -500"},duration:1.4,ease:"none"},wheelStart+4.55)
   .to(".story-arc-svg",{y:()=>{
     const svg=arc.querySelector<SVGSVGElement>(".story-arc-svg")!;
     const last=svg.querySelectorAll("text");
     const halfWord=(last[last.length-1]?.getComputedTextLength()??350)/2;
     const scale=svg.getBoundingClientRect().width/3000;
     return (parseFloat(getComputedStyle(svg).bottom)||0)+30+(1600-100+halfWord)*scale;
   },duration:1.65,ease:"none"},wheelStart+5.95)
   .set(arc,{autoAlpha:0},wheelStart+7.65)
   .to(products,{autoAlpha:1,duration:.2,ease:"none"},wheelStart+7.65)
   .fromTo(products,{scale:.22,y:()=>innerHeight*.39,clipPath:viewportClip},{scale:1,y:0,duration:1.65,ease:"none"},wheelStart+7.95)
   .to(productContent,{autoAlpha:1,duration:.55,ease:"none"},wheelStart+8.95)
   .set(products,{clipPath:"none"},wheelStart+9.6)
   .to({}, {duration:.15});
 }
 const curve=document.querySelector<SVGPathElement>(".story-curve-draw");
 if(curve){
  const length=curve.getTotalLength();
  const small=()=>innerWidth<=800;
  gsap.set(curve,{strokeDasharray:length,strokeDashoffset:length});
  const reveal=gsap.timeline({scrollTrigger:{id:"curve-story",trigger:".story-curve",start:"top top",end:()=>`+=${innerHeight*1.25}`,pin:true,scrub:.65,anticipatePin:1,invalidateOnRefresh:true}});
  gsap.fromTo(curve,{strokeDashoffset:length},{strokeDashoffset:0,ease:"none",scrollTrigger:{trigger:".story-curve",start:"top 95%",end:()=>`+=${innerHeight*1.5}`,scrub:.6}});
  reveal.fromTo(".curve-window",{left:()=>small()?"38%":"40%",top:"43%",width:()=>small()?"42%":"24%",height:"26%",autoAlpha:1},{left:"0%",top:"0%",width:"100%",height:"100%",autoAlpha:1,duration:.65,ease:"none"},.25)
   .fromTo(".curve-window-content",{xPercent:-42},{xPercent:0,duration:.65,ease:"none"},.25)
   .to(".curve-window-content",{y:()=>-Math.max(0,(document.querySelector<HTMLElement>(".curve-window-content")?.scrollHeight??0)-innerHeight),duration:.5,ease:"none"},1.05)
   .to({}, {duration:.2});
  gsap.to(".curve-ticker > span",{xPercent:-18,ease:"none",scrollTrigger:{trigger:".story-curve",start:"top top",end:()=>`+=${innerHeight*1.25}`,scrub:.8}});
 }
}
