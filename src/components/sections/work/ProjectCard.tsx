import StarBorder from "@/components/StarBorder";
import type { Project } from "@/types/portfolio";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => (
  <StarBorder
    as="div"
    className="scroll-stack-card"
    color="#00f2fe, #4facfe, #7000ff"
    speed="8s"
  >
    <div className="card-top-row">
      <div className="id-brand-group">
        <span className="huge-number">{project.id}</span>
        <div className="client-info">
          <span className="label">{project.title}</span>
          <span className="client-name">{project.stack}</span>
        </div>
      </div>

      <StarBorder
        as="a"
        href={project.links.live}
        target="_blank"
        rel="noopener noreferrer"
        className="live-btn-star"
        color="#f6d365, #fda085"
        speed="3s"
      >
        {project.cta}
      </StarBorder>
    </div>

    <div className="content-grid">
      <img
        src={project.image}
        className="main-image w-full h-auto object-contain"
        alt={project.title}
        onLoad={() => window.dispatchEvent(new Event("resize"))}
      />
      <div className="project-description">
        <p>{project.description}</p>
      </div>
    </div>
  </StarBorder>
);

export default ProjectCard;
