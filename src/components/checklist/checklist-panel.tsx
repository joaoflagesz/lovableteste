import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2, Save, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { DamageMap, type DamageMark } from "@/components/checklist/damage-map";
import { SignaturePad } from "@/components/checklist/signature-pad";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useChecklist, useChecklistMedia } from "@/lib/data";
import { CHECKLIST_ITEMS, PHOTO_SLOTS } from "@/lib/os";

type ItemState = Record<string, string>;

const CONDITIONS = ["ok", "avaria", "faltando", "na"] as const;
const CONDITION_LABEL: Record<string, string> = {
  ok: "OK",
  avaria: "Avaria",
  faltando: "Faltando",
  na: "N/A",
};

export function ChecklistPanel({
  orderId,
  type,
}: {
  orderId: string;
  type: "entrada" | "saida";
}) {
  const qc = useQueryClient();
  const { data: checklist, isLoading } = useChecklist(orderId, type);
  const { data: media } = useChecklistMedia(checklist?.id);

  const [items, setItems] = useState<ItemState>({});
  const [marks, setMarks] = useState<DamageMark[]>([]);
  const [kind, setKind] = useState("risco");
  const [km, setKm] = useState("");
  const [fuel, setFuel] = useState(50);
  const [notes, setNotes] = useState("");
  const [clientSig, setClientSig] = useState<string | null>(null);
  const [staffSig, setStaffSig] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const pendingSlot = useRef<string>("frente");

  useEffect(() => {
    if (!checklist) return;
    setItems((checklist.items as ItemState) ?? {});
    setMarks((checklist.damage_marks as unknown as DamageMark[]) ?? []);
    setKm(checklist.km ? String(checklist.km) : "");
    setFuel(checklist.fuel_level ?? 50);
    setNotes(checklist.notes ?? "");
    setClientSig(checklist.client_signature);
    setStaffSig(checklist.consultant_signature);
  }, [checklist]);

  const save = useMutation({
    mutationFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      const payload = {
        order_id: orderId,
        type,
        items: items as never,
        damage_marks: marks as never,
        km: km ? Number(km) : null,
        fuel_level: fuel,
        notes: notes.trim() || null,
        client_signature: clientSig,
        consultant_signature: staffSig,
        created_by: auth.user?.id ?? null,
      };
      if (checklist) {
        const { error } = await supabase
          .from("checklists")
          .update(payload)
          .eq("id", checklist.id);
        if (error) throw new Error(error.message);
        return checklist.id;
      }
      const { data, error } = await supabase
        .from("checklists")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      return data.id;
    },
    onSuccess: () => {
      toast.success("Checklist salvo");
      qc.invalidateQueries({ queryKey: ["checklist", orderId, type] });
    },
    onError: (e: Error) => toast.error("Erro ao salvar", { description: e.message }),
  });

  async function handleFile(file: File) {
    try {
      setUploading(pendingSlot.current);
      let checklistId = checklist?.id;
      if (!checklistId) checklistId = await save.mutateAsync();
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${orderId}/${type}/${pendingSlot.current}-${Date.now()}.${ext}`;
      const up = await supabase.storage.from("oficina").upload(path, file, { upsert: true });
      if (up.error) throw new Error(up.error.message);
      const { data: auth } = await supabase.auth.getUser();
      const { error } = await supabase.from("media").insert({
        order_id: orderId,
        checklist_id: checklistId,
        storage_path: path,
        slot: pendingSlot.current,
        kind: "foto",
        created_by: auth.user?.id ?? null,
      });
      if (error) throw new Error(error.message);
      toast.success("Foto anexada");
      qc.invalidateQueries({ queryKey: ["checklist-media", checklistId] });
    } catch (e) {
      toast.error("Falha no upload", { description: (e as Error).message });
    } finally {
      setUploading(null);
    }
  }

  if (isLoading) return <div className="surface-card h-64 animate-pulse opacity-60" />;

  const okCount = Object.values(items).filter((v) => v === "ok").length;

  return (
    <div className="space-y-5">
      <div className="surface-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-sm font-bold">
              Checklist de {type === "entrada" ? "entrada" : "saída"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {okCount} de {CHECKLIST_ITEMS.length} itens conferidos como OK
            </p>
          </div>
          <Button size="sm" onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending ? (
              <Loader2 className="mr-1.5 size-4 animate-spin" />
            ) : (
              <Save className="mr-1.5 size-4" />
            )}
            Salvar
          </Button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`km-${type}`}>KM do veículo</Label>
            <Input
              id={`km-${type}`}
              type="number"
              min={0}
              value={km}
              onChange={(e) => setKm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Nível de combustível: {fuel}%</Label>
            <Slider
              value={[fuel]}
              onValueChange={(v) => setFuel(v[0] ?? 0)}
              max={100}
              step={5}
              className="pt-3"
            />
          </div>
        </div>
      </div>

      <div className="surface-card p-4">
        <h3 className="font-display text-sm font-bold">Itens conferidos</h3>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {CHECKLIST_ITEMS.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-accent/30 px-3 py-2"
            >
              <span className="truncate text-sm">{item.label}</span>
              <Select
                value={items[item.key] ?? "na"}
                onValueChange={(v) => setItems({ ...items, [item.key]: v })}
              >
                <SelectTrigger className="h-8 w-28 shrink-0 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {CONDITION_LABEL[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <div className="surface-card p-4">
        <h3 className="font-display text-sm font-bold">Mapa de avarias</h3>
        <p className="mb-3 text-xs text-muted-foreground">
          Selecione o tipo e toque no diagrama para marcar a avaria.
        </p>
        <DamageMap marks={marks} onChange={setMarks} kind={kind} onKindChange={setKind} />
      </div>

      <div className="surface-card p-4">
        <h3 className="font-display text-sm font-bold">Fotos do veículo</h3>
        <p className="mb-3 text-xs text-muted-foreground">
          Registre as quatro laterais. As imagens ficam armazenadas com acesso restrito.
        </p>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PHOTO_SLOTS.map((slot) => {
            const photos = (media ?? []).filter((m) => m.slot === slot.key);
            return (
              <div key={slot.key} className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    pendingSlot.current = slot.key;
                    fileInput.current?.click();
                  }}
                  className="flex aspect-square w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-accent/30 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {uploading === slot.key ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Camera className="size-5" />
                  )}
                  {slot.label}
                  {photos.length > 0 && (
                    <span className="rounded-full bg-primary/15 px-2 text-[10px] text-primary">
                      {photos.length} foto(s)
                    </span>
                  )}
                </button>
                {photos.map((p) => (
                  <PhotoThumb key={p.id} path={p.storage_path} mediaId={p.id} />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="surface-card p-4">
        <h3 className="font-display text-sm font-bold">Observações e assinaturas</h3>
        <div className="mt-3 space-y-4">
          <Textarea
            maxLength={1000}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observações do checklist, itens pessoais no veículo, combinações com o cliente..."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <SignaturePad label="Assinatura do cliente" value={clientSig} onChange={setClientSig} />
            <SignaturePad label="Assinatura do consultor" value={staffSig} onChange={setStaffSig} />
          </div>
          <Button onClick={() => save.mutate()} disabled={save.isPending} className="w-full">
            {save.isPending ? (
              <Loader2 className="mr-1.5 size-4 animate-spin" />
            ) : (
              <Save className="mr-1.5 size-4" />
            )}
            Salvar checklist
          </Button>
        </div>
      </div>
    </div>
  );
}

function PhotoThumb({ path, mediaId }: { path: string; mediaId: string }) {
  const qc = useQueryClient();
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.storage
      .from("oficina")
      .createSignedUrl(path, 3600)
      .then(({ data }) => {
        if (active) setUrl(data?.signedUrl ?? null);
      });
    return () => {
      active = false;
    };
  }, [path]);

  async function remove() {
    await supabase.storage.from("oficina").remove([path]);
    await supabase.from("media").delete().eq("id", mediaId);
    qc.invalidateQueries({ queryKey: ["checklist-media"] });
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border">
      {url ? (
        <img src={url} alt="Foto do veículo" className="aspect-square w-full object-cover" />
      ) : (
        <div className="aspect-square w-full animate-pulse bg-accent" />
      )}
      <button
        type="button"
        onClick={remove}
        className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-lg bg-background/80 text-destructive backdrop-blur"
        aria-label="Remover foto"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}
