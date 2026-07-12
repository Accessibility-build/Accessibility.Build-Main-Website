import {
  Accessibility,
  Binary,
  Braces,
  Code2,
  Contrast,
  FileCheck2,
  FileText,
  Globe2,
  Heading,
  ImageIcon,
  Link2,
  LockKeyhole,
  Palette,
  Pipette,
  Scale,
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
}

interface ToolIconProps {
  name: ToolIconName
  className?: string
}

export function ToolIcon({ name, className }: ToolIconProps) {
  const Icon = icons[name] ?? WandSparkles
  return <Icon className={className} aria-hidden="true" />
}

