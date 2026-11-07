import { site } from "../../data";
export default function NavigationTransition() {
  return (
    <div className="navigation-transition" aria-hidden="true">
      <div className="transition-panels">
        {Array.from({ length: 4 }, (_, i) => (
          <div className="transition-panel" key={i} />
        ))}
      </div>
      <div className="transition-caption">
        <span className="mono">{site.ui.transitionLabel}</span>
        <span className="transition-target">{site.brand.name}</span>
        <span className="transition-symbol">↗</span>
      </div>
    </div>
  );
}
