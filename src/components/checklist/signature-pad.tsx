import { Eraser } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

/** Área de assinatura por toque/mouse. Exporta PNG em data URL. */
export function SignaturePad({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  disabled?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = getComputedStyle(canvas).color;
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = value;
    }
  }, [value]);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {!disabled && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              const canvas = canvasRef.current;
              const ctx = canvas?.getContext("2d");
              if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
              setDirty(false);
              onChange(null);
            }}
          >
            <Eraser className="mr-1.5 size-3.5" /> Limpar
          </Button>
        )}
      </div>
      <canvas
        ref={canvasRef}
        className="h-36 w-full touch-none rounded-xl border border-dashed border-border bg-accent/40 text-foreground"
        onPointerDown={(e) => {
          if (disabled) return;
          drawing.current = true;
          const ctx = e.currentTarget.getContext("2d");
          const p = pos(e);
          ctx?.beginPath();
          ctx?.moveTo(p.x, p.y);
        }}
        onPointerMove={(e) => {
          if (!drawing.current || disabled) return;
          const ctx = e.currentTarget.getContext("2d");
          const p = pos(e);
          ctx?.lineTo(p.x, p.y);
          ctx?.stroke();
          setDirty(true);
        }}
        onPointerUp={(e) => {
          if (!drawing.current) return;
          drawing.current = false;
          if (dirty) onChange(e.currentTarget.toDataURL("image/png"));
        }}
        onPointerLeave={(e) => {
          if (!drawing.current) return;
          drawing.current = false;
          if (dirty) onChange(e.currentTarget.toDataURL("image/png"));
        }}
      />
      {!dirty && !value && (
        <p className="text-[11px] text-muted-foreground">Assine com o dedo ou mouse.</p>
      )}
    </div>
  );
}
