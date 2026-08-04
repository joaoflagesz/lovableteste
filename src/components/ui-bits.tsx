import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { PART_STATUS_LABEL, STATUS_LABEL, priorityMeta, statusTone } from "@/lib/os";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "primary",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: "primary" | "success" | "warning" | "destructive" | "info";
}) {
  const accents: Record<string, string> = {
    primary: "bg-primary/12 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/15 text-destructive",
    info: "bg-info/15 text-info",
  };
  return (
    <div className="surface-card animate-rise p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-1.5 font-display text-2xl font-bold tabular-nums">{value}</p>
          {hint && <p className="mt-1 truncate text-[11px] text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn("grid size-9 shrink-0 place-items-center rounded-xl", accents[accent])}>
          <Icon className="size-4.5" />
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("border font-medium", statusTone(status))}>
      {STATUS_LABEL[status] ?? status}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const meta = priorityMeta(priority);
  return (
    <Badge variant="outline" className={cn("border font-medium", meta.className)}>
      {meta.label}
    </Badge>
  );
}

export function PartStatusBadge({ status }: { status: string }) {
  const tone =
    status === "recebida"
      ? "bg-success/15 text-success border-success/30"
      : status === "nao_solicitada"
        ? "bg-destructive/15 text-destructive border-destructive/30"
        : "bg-warning/15 text-warning border-warning/30";
  return (
    <Badge variant="outline" className={cn("border font-medium", tone)}>
      {PART_STATUS_LABEL[status] ?? status}
    </Badge>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="surface-card flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="grid size-12 place-items-center rounded-2xl bg-accent text-muted-foreground">
        <Icon className="size-6" />
      </div>
      <h3 className="mt-4 font-display text-base font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function SkeletonList({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="surface-card h-20 animate-pulse opacity-60" />
      ))}
    </div>
  );
}
