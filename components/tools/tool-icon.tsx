import {
  Accessibility,
  AudioLines,
  Binary,
  BookOpenText,
  Braces,
  Code2,
  Contrast,
  Eye,
  FileCheck2,
  FileText,
  Gauge,
  Globe2,
  Heading,
  ImageIcon,
  Keyboard,
  Layers,
  Link2,
  LockKeyhole,
  MousePointerClick,
  Palette,
  Pipette,
  Presentation,
  Scale,
  ScanEye,
  ScanSearch,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Type,
  WandSparkles,
  type LucideIcon,
} from "lucide-react"
import type { ToolIconName } from "@/lib/tool-catalog"

const icons: Record<ToolIconName, LucideIcon> = {
  scan: ScanSearch,
  image: ImageIcon,
  contrast: Contrast,
  heading: Heading,
  palette: Palette,
  sparkles: Sparkles,
  type: Type,
  mobile: Smartphone,
  code: Code2,
  shield: ShieldCheck,
  globe: Globe2,
  report: FileText,
  statement: FileCheck2,
  scale: Scale,
  trending: TrendingUp,
  overlay: Accessibility,
  pdf: FileText,
  pipette: Pipette,
  binary: Binary,
  link: Link2,
  lock: LockKeyhole,
  braces: Braces,
  book: BookOpenText,
  layers: Layers,
  eye: Eye,
  speech: AudioLines,
  office: Presentation,
  altText: ScanEye,
  keyboard: Keyboard,
  gauge: Gauge,
  pointer: MousePointerClick,
}

interface ToolIconProps {
  name: ToolIconName
  className?: string
}

export function ToolIcon({ name, className }: ToolIconProps) {
  const Icon = icons[name] ?? WandSparkles
  return <Icon className={className} aria-hidden="true" />
}

