import { useCallback } from "react";
import { ArrowUpRight } from "lucide-react";
import { site } from "../../data";
import ProjectGallery from "../ui/ProjectGallery";
import GlassModal from "./GlassModal";
type Project = (typeof site.projects)[number];
export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const close = useCallback(onClose, [onClose]);
  return (
    <GlassModal id="project-modal" title={project.name} onClose={close}>
      <div className="project-modal-heading">
        <span className="eyebrow">{project.category}</span>
        <h2 id="project-modal-title">{project.name}</h2>
        <p>{project.description}</p>
        <div className="project-modal-tags">
          {project.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
      <ProjectGallery key={project.id} name={project.name} images={project.gallery} />
      <div className="project-modal-bottom">
        <span className="mono">{project.kind}</span>
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="button"
        >
          {site.solutions.modal.projectCta}
          <ArrowUpRight size={18} />
        </a>
        <p>{site.solutions.modal.projectNotice}</p>
      </div>
    </GlassModal>
  );
}
