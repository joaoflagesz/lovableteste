import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipboardList, Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { EmptyState, PriorityBadge, SkeletonList, StatusBadge } from "@/components/ui-bits";
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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useClients, useOrders, useProfiles, useVehicles } from "@/lib/data";
import { OS_STATUSES, PRIORITIES, formatBRL, formatDate, orderTotal } from "@/lib/os";

export const Route = createFileRoute("/_authenticated/ordens")({
  head: () => ({
    meta: [
      { title: "Ordens de Serviço — NexCheck Oficina" },
      {
        name: "description",
        content: "Abra, acompanhe e atualize ordens de serviço com status, peças e checklist.",
      },
      { property: "og:title", content: "Ordens de Serviço — NexCheck Oficina" },
      {
        property: "og:description",
        content: "Abra, acompanhe e atualize ordens de serviço com status, peças e checklist.",
      },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("todos");
  const { data, isLoading } = useOrders(search);

  const filtered = (data ?? []).filter((o) => (status === "todos" ? true : o.status === status));

  return (
    <AppShell
      title="Ordens de serviço"
      subtitle={`${filtered.length} ordens`}
      action={<NewOrderDialog />}
    >
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por número, placa, cliente..."
            className="pl-9"
            maxLength={80}
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            {OS_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <SkeletonList rows={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Nenhuma ordem de serviço"
          description="Abra uma OS informando cliente, veículo e o serviço solicitado."
          action={<NewOrderDialog />}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <Link
              key={o.id}
              to="/ordens/$id"
              params={{ id: o.id }}
              className="surface-card block p-4 transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold">OS #{o.number}</span>
                    <span className="rounded-md border border-border bg-accent px-1.5 py-0.5 text-[11px] font-semibold tracking-wider">
                      {o.vehicles?.plate ?? "—"}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {o.clients?.name ?? "Sem cliente"} ·{" "}
                    {[o.vehicles?.brand, o.vehicles?.model].filter(Boolean).join(" ") || "veículo"}
                  </p>
                  {o.description && (
                    <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                      {o.description}
                    </p>
                  )}
                </div>
                <PriorityBadge priority={o.priority} />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <StatusBadge status={o.status} />
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Entrada {formatDate(o.entry_at)}</span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {formatBRL(orderTotal(o))}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}

function NewOrderDialog() {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const { data: clients } = useClients("");
  const { data: vehicles } = useVehicles("");
  const { data: profiles } = useProfiles();
  const [form, setForm] = useState({
    client_id: "",
    vehicle_id: "",
    priority: "normal",
    assignee_id: "",
    description: "",
    notes: "",
    total_services: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!form.client_id) throw new Error("Selecione o cliente.");
      if (!form.vehicle_id) throw new Error("Selecione o veículo.");
      const { data: auth } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("service_orders")
        .insert({
          client_id: form.client_id,
          vehicle_id: form.vehicle_id,
          priority: form.priority as "baixa" | "normal" | "alta" | "urgente",
          assignee_id: form.assignee_id || null,
          description: form.description.trim() || null,
          notes: form.notes.trim() || null,
          total_services: form.total_services ? Number(form.total_services) : 0,
          created_by: auth.user?.id ?? null,
        })
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast.success("Ordem de serviço criada");
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      setOpen(false);
    },
    onError: (e: Error) => toast.error("Erro", { description: e.message }),
  });

  const clientVehicles = (vehicles ?? []).filter(
    (v) => !form.client_id || v.client_id === form.client_id,
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1.5 size-4" /> Nova OS
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova ordem de serviço</DialogTitle>
          <DialogDescription>
            A numeração da OS é gerada automaticamente na sequência.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Cliente *</Label>
            <Select
              value={form.client_id}
              onValueChange={(v) => setForm({ ...form, client_id: v, vehicle_id: "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar cliente" />
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
            <Label>Veículo *</Label>
            <Select
              value={form.vehicle_id}
              onValueChange={(v) => setForm({ ...form, vehicle_id: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar veículo" />
              </SelectTrigger>
              <SelectContent>
                {clientVehicles.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.plate} · {[v.brand, v.model].filter(Boolean).join(" ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm({ ...form, priority: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Responsável</Label>
              <Select
                value={form.assignee_id}
                onValueChange={(v) => setForm({ ...form, assignee_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {(profiles ?? []).map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="o-desc">Serviço solicitado</Label>
            <Textarea
              id="o-desc"
              maxLength={1000}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Reclamação do cliente e serviços a executar"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="o-serv">Valor de mão de obra (R$)</Label>
            <Input
              id="o-serv"
              type="number"
              min={0}
              step="0.01"
              value={form.total_services}
              onChange={(e) => setForm({ ...form, total_services: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="w-full sm:w-auto"
          >
            Abrir OS
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
