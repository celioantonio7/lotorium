import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type GalleryImage = { src: string; alt: string };
export default function ProjectGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [selected, setSelected] = useState(0);
  const touchStart = useRef<number | null>(null);
  const show = (index: number) => setSelected((index + images.length) % images.length);
  const current = images[selected];
  return <div className="project-gallery" role="region" aria-label={`Galeria de ${name}`} onKeyDown={event => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      show(selected + (event.key === "ArrowRight" ? 1 : -1));
    }
  }}>
    <div className="project-gallery-stage" onPointerDown={event => { if (event.pointerType === "touch") touchStart.current = event.clientX; }} onPointerUp={event => {
      if (event.pointerType !== "touch" || touchStart.current === null) return;
      const delta = event.clientX - touchStart.current;
      touchStart.current = null;
      if (Math.abs(delta) > 45) show(selected + (delta < 0 ? 1 : -1));
    }} onPointerCancel={() => { touchStart.current = null; }}>
      <img src={current.src} alt={current.alt} width="1440" height="900" />
      <button type="button" className="project-gallery-arrow is-previous" aria-label="Imagem anterior" onClick={() => show(selected - 1)}><ChevronLeft aria-hidden="true" /></button>
      <button type="button" className="project-gallery-arrow is-next" aria-label="Próxima imagem" onClick={() => show(selected + 1)}><ChevronRight aria-hidden="true" /></button>
    </div>
    <div className="project-gallery-caption" aria-live="polite" aria-atomic="true"><span>{current.alt}</span><span>{selected + 1} / {images.length}</span></div>
    <div className="project-gallery-thumbnails" aria-label="Escolher imagem">
      {images.map((image, index) => <button type="button" key={image.src} aria-label={`Ver imagem ${index + 1} de ${name}`} aria-pressed={index === selected} onClick={() => show(index)}>
        <img src={image.src} alt="" width="160" height="100" loading="lazy" />
        <span>{String(index + 1).padStart(2, "0")}</span>
      </button>)}
    </div>
  </div>;
}
