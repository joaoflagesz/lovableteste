import { X } from "lucide-react";

import carTop from "@/assets/car-top.png";
import { Button } from "@/components/ui/button";

export type DamageMark = { x: number; y: number; kind: string };

const KINDS = [
  { key: "risco", label: "Risco", color: "bg-warning" },
  { key: "amassado", label: "Amassado", color: "bg-destructive" },
  { key: "trincado", label: "Trincado", color: "bg-chart-5" },
  { key: "faltando", label: "Faltando", color: "bg-info" },
] as const;

export function DamageMap({
  marks,
  onChange,
  kind,
  onKindChange,
  disabled = false,
}: {
  marks: DamageMark[];
  onChange: (marks: DamageMark[]) => void;
  kind: string;
  onKindChange: (kind: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {KINDS.map((k) => (
          <button
            key={k.key}
            type="button"
            disabled={disabled}
            onClick={() => onKindChange(k.key)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              kind === k.key
                ? "border-primary bg-primary/12 text-primary"
                : "border-border bg-accent/50 text-muted-foreground"
            }`}
          >
            <span className={`size-2.5 rounded-full ${k.color}`} />
            {k.label}
          </button>
        ))}
      </div>

      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-accent/40"
        onClick={(e) => {
          if (disabled) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          onChange([...marks, { x, y, kind }]);
        }}
      >
        <img
          src={carTop}
          alt="Diagrama do veículo para marcação de avarias"
          className="w-full select-none opacity-90"
          draggable={false}
        />
        {marks.map((m, i) => {
          const color = KINDS.find((k) => k.key === m.kind)?.color ?? "bg-primary";
          return (
            <button
              key={`${m.x}-${m.y}-${i}`}
              type="button"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                if (disabled) return;
                onChange(marks.filter((_, idx) => idx !== i));
              }}
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${color} size-5 border-2 border-background text-[9px] font-bold text-background shadow`}
              aria-label={`Remover marcação ${m.kind}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {marks.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {marks.length} avaria(s) marcada(s) — toque no ponto para remover.
          </span>
          {!disabled && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange([])}>
              <X className="mr-1.5 size-3.5" /> Limpar tudo
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
