import {
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Building2,
  Code2,
  ChevronDown,
  ChevronRight,
  Database,
  ExternalLink,
  Frame,
  File,
  FileText,
  Folder,
  Gamepad2,
  Home,
  LayoutGrid,
  Mail,
  Maximize2,
  Monitor,
  MonitorSmartphone,
  Minus,
  NotebookPen,
  Palette,
  Plus,
  Smartphone,
  RefreshCw,
  Truck,
  UserRound,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";

export type SystemIconName =
  | "arrow-down" | "arrow-left" | "arrow-right" | "arrow-up" | "chevron-down" | "chevron-right" | "close"
  | "building" | "code" | "contact" | "database" | "external" | "figma" | "file"
  | "folder" | "game" | "home" | "launcher" | "maximize"
  | "mobile" | "monitor" | "minus" | "notes" | "paint" | "plus" | "report" | "resume"
  | "responsive" | "sync" | "truck" | "users";

const iconMap: Record<SystemIconName, LucideIcon> = {
  "arrow-down": ArrowDown,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  "chevron-down": ChevronDown,
  "chevron-right": ChevronRight,
  building: Building2,
  code: Code2,
  close: X,
  contact: Mail,
  database: Database,
  external: ExternalLink,
  figma: Frame,
  file: File,
  folder: Folder,
  game: Gamepad2,
  home: Home,
  launcher: LayoutGrid,
  maximize: Maximize2,
  mobile: Smartphone,
  monitor: Monitor,
  minus: Minus,
  notes: NotebookPen,
  paint: Palette,
  plus: Plus,
  report: UserRound,
  resume: FileText,
  responsive: MonitorSmartphone,
  sync: RefreshCw,
  truck: Truck,
  users: UsersRound,
};

export function SystemIcon({ name, size = 18, strokeWidth = 1.7, className }: { name: SystemIconName; size?: number; strokeWidth?: number; className?: string }) {
  const Icon = iconMap[name];
  return <Icon aria-hidden="true" className={className} size={size} strokeWidth={strokeWidth} />;
}
