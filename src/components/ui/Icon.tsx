import {
  ArrowUpRight,
  Diamond,
  MousePointer2,
  Code2,
  Box,
  Zap,
  Monitor,
  Palette,
  Compass,
  Layers,
  Infinity,
  Link2,
  Workflow,
  BrainCircuit,
  ChartNoAxesCombined,
  Search,
  Target,
  PenTool,
  Users,
  Star,
  Cloud,
  Database,
  CalendarDays,
  MessageCircle,
  LayoutDashboard,
} from "lucide-react";
const icons = {
  diamond: Diamond,
  pointer: MousePointer2,
  code: Code2,
  box: Box,
  zap: Zap,
  monitor: Monitor,
  palette: Palette,
  compass: Compass,
  layers: Layers,
  infinity: Infinity,
  link: Link2,
  workflow: Workflow,
  brain: BrainCircuit,
  chart: ChartNoAxesCombined,
  search: Search,
  target: Target,
  pen: PenTool,
  users: Users,
  star: Star,
  cloud: Cloud,
  database: Database,
  calendar: CalendarDays,
  message: MessageCircle,
  dashboard: LayoutDashboard,
  arrow: ArrowUpRight,
};
export default function Icon({
  name,
  className = "",
  size = 24,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Component = icons[name as keyof typeof icons] ?? ArrowUpRight;
  return (
    <Component
      size={size}
      strokeWidth={1.5}
      className={className}
      aria-hidden="true"
    />
  );
}
