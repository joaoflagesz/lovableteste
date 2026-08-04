import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Car, Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { EmptyState, SkeletonList } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useClients, useVehicles } from "@/lib/data";
import { FUEL_OPTIONS, formatPlate } from "@/lib/os";

export const Route = createFileRoute("/_authenticated/veiculos")({
  head: () => ({
    meta: [
      { title: "Veículos — NexCheck Oficina" },
      {
        name: "description",
        content: "Frota e veículos dos clientes com placa, chassi, motorização e histórico.",
      },
      { property: "og:title", content: "Veículos — NexCheck Oficina" },
      {
        property: "og:description",
        content: "Frota e veículos dos clientes com placa, chassi, motorização e histórico.",
      },
    ],
  }),
  component: VehiclesPage,
});

function VehiclesPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useVehicles(search);

  return (
    <AppShell
      title="Veículos"
      subtitle={`${data?.length ?? 0} cadastrados`}
      action={<NewVehicleDialog />}
    >
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por placa, marca, modelo ou chassi..."
          className="pl-9"
          maxLength={80}
        />
      </div>

      {isLoading ? (
        <SkeletonList />
      ) : (data?.length ?? 0) === 0 ? (
        <EmptyState
          icon={Car}
          title="Nenhum veículo encontrado"
          description="Cadastre um veículo vinculado a um cliente para abrir ordens de serviço."
          action={<NewVehicleDialog />}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data!.map((v) => (
            <div key={v.id} className="surface-card p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-lg border border-border bg-accent px-2.5 py-1 font-display text-sm font-bold tracking-wider">
                  {v.plate}
                </span>
                {v.year && <span className="text-xs text-muted-foreground">{v.year}</span>}
              </div>
              <p className="mt-3 truncate text-sm font-semibold">
                {[v.brand, v.model].filter(Boolean).join(" ") || "Veículo"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {[v.color, v.fuel, v.transmission].filter(Boolean).join(" · ") || "—"}
              </p>
              <p className="mt-2 truncate text-xs text-muted-foreground">
                {v.clients?.name ?? "Sem cliente vinculado"}
              </p>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}

export function NewVehicleDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const { data: clients } = useClients("");
  const [form, setForm] = useState({
    plate: "",
    brand: "",
    model: "",
    year: "",
    color: "",
    km: "",
    fuel: "",
    transmission: "",
    engine: "",
    chassis: "",
    renavam: "",
    client_id: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const plate = formatPlate(form.plate);
      if (plate.length < 7) throw new Error("Informe uma placa válida (7 caracteres).");
      const { error } = await supabase.from("vehicles").insert({
        plate,
        brand: form.brand.trim() || null,
        model: form.model.trim() || null,
        year: form.year.trim() || null,
        color: form.color.trim() || null,
        km: form.km ? Number(form.km) : null,
        fuel: form.fuel || null,
        transmission: form.transmission || null,
        engine: form.engine.trim() || null,
        chassis: form.chassis.trim() || null,
        renavam: form.renavam.trim() || null,
        client_id: form.client_id || null,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Veículo cadastrado");
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      setOpen(false);
    },
    onError: (e: Error) => toast.error("Erro", { description: e.message }),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus className="mr-1.5 size-4" /> Novo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo veículo</DialogTitle>
          <DialogDescription>
            Informe a placa e os dados do veículo. Consulta automática de placa entra na fase 2.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="v-plate">Placa *</Label>
            <Input
              id="v-plate"
              value={form.plate}
              onChange={(e) => setForm({ ...form, plate: formatPlate(e.target.value) })}
              placeholder="ABC1D23"
              className="font-display tracking-wider"
            />
          </div>
          <div className="space-y-2">
            <Label>Cliente</Label>
            <Select
              value={form.client_id}
              onValueChange={(value) => setForm({ ...form, client_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {(clients ?? []).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-brand">Marca</Label>
            <Input
              id="v-brand"
              maxLength={40}
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-model">Modelo</Label>
            <Input
              id="v-model"
              maxLength={60}
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-year">Ano</Label>
            <Input
              id="v-year"
              maxLength={9}
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              placeholder="2020/2021"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-color">Cor</Label>
            <Input
              id="v-color"
              maxLength={30}
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-km">KM</Label>
            <Input
              id="v-km"
              type="number"
              min={0}
              value={form.km}
              onChange={(e) => setForm({ ...form, km: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Combustível</Label>
            <Select value={form.fuel} onValueChange={(v) => setForm({ ...form, fuel: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {FUEL_OPTIONS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Câmbio</Label>
            <Select
              value={form.transmission}
              onValueChange={(v) => setForm({ ...form, transmission: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="Automático">Automático</SelectItem>
                <SelectItem value="Automatizado">Automatizado</SelectItem>
                <SelectItem value="CVT">CVT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-engine">Motorização</Label>
            <Input
              id="v-engine"
              maxLength={30}
              value={form.engine}
              onChange={(e) => setForm({ ...form, engine: e.target.value })}
              placeholder="1.0 Turbo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-chassis">Chassi</Label>
            <Input
              id="v-chassis"
              maxLength={30}
              value={form.chassis}
              onChange={(e) => setForm({ ...form, chassis: e.target.value.toUpperCase() })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-renavam">Renavam</Label>
            <Input
              id="v-renavam"
              maxLength={20}
              value={form.renavam}
              onChange={(e) => setForm({ ...form, renavam: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="w-full sm:w-auto"
          >
            Salvar veículo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
