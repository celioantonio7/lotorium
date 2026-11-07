import { useEffect, useRef } from "react";
import { site } from "../../data";
import "./devices/devices.css";

type Project = (typeof site.projects)[number];
export default function DeviceShowcase({project,onExplore}:{project:Project;onExplore:()=>void}) {
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const host=ref.current;if(!host)return;
    const resize=new ResizeObserver(()=>host.style.setProperty("--device-unit",String(host.clientWidth/900)));
    resize.observe(host);return()=>resize.disconnect();
  },[]);
  const devices=[{model:"ipad-pro",kind:"tablet",src:site.web.deviceImages.tablet,label:"Tablet"},{model:"macbook-pro",kind:"notebook",src:project.image,label:"Notebook"},{model:"iphone-14-pro",kind:"phone",src:site.web.deviceImages.phone,label:"iPhone"}];
  return <div ref={ref} className="device-showcase" data-reveal>
    {devices.map(device=><button className={`showcase-device showcase-${device.kind}`} key={device.kind} onClick={onExplore} aria-label={`Explorar projeto ${project.name} no ${device.label}`}>
      <span className={`device device-${device.model} device-spacegray`} aria-hidden="true">
        <span className="device-frame"><img className="device-screen" src={device.src} alt="" loading="lazy" /></span>
        <span className="device-stripe"/><span className="device-header"/><span className="device-sensors"/><span className="device-btns"/><span className="device-power"/><span className="device-home"/>
      </span>
    </button>)}
    <span className="showcase-caption mono">{site.web.deviceCaption}</span>
  </div>;
}
