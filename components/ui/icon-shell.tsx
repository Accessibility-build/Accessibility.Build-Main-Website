import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type IconShellSize = "sm" | "md" | "lg" | "xl";
type IconShellTone = "subtle" | "accent" | "hero" | "success" | "warning";

interface IconShellProps {
  icon: LucideIcon;
  size?: IconShellSize;
  tone?: IconShellTone;
  className?: string;
  iconClassName?: string;
  ariaHidden?: boolean;
}

const shellSizeMap: Record<IconShellSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const iconSizeMap: Record<IconShellSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

const toneMap: Record<IconShellTone, string> = {
  subtle:
    "border border-border/60 bg-muted/40 text-muted-foreground",
  accent:
    "border border-primary/25 bg-primary/10 text-primary",
  hero:
    "border border-primary/30 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm",
  success:
    "border border-emerald-300 bg-emerald-100 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100",
  warning:
    "border border-amber-300 bg-amber-100 text-amber-900 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-100",
};

export function IconShell({
  icon: Icon,
  size = "md",
  tone = "subtle",
  className,
  iconClassName,
  ariaHidden = true,
}: IconShellProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-xl",
        shellSizeMap[size],
        toneMap[tone],
        className,
      )}
    >
      <Icon className={cn(iconSizeMap[size], iconClassName)} aria-hidden={ariaHidden} />
    </span>
  );
}
