import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ClipboardCheck,
  History,
  MessageCircle,
  Package,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ChecklistPanel } from "@/components/checklist/checklist-panel";
import { AppShell } from "@/components/layout/app-shell";
import { PartStatusBadge, PriorityBadge, StatusBadge } from "@/components/ui-bits";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useHistory, useOrder, useParts, useProfiles, useUpdateOrder } from "@/lib/data";
import {
  OS_STATUSES,
  PART_STATUSES,
  PRIORITIES,
  STATUS_LABEL,
  formatBRL,
  formatDate,
  formatDateTime,
  orderTotal,
} from "@/lib/os";

export const Route = createFileRoute("/_authenticated/ordens/$id")({
  head: () => ({
    meta: [
      { title: "Detalhe da OS — NexCheck Oficina" },
      {
        name: "description",
        content: "Acompanhe status, peças, checklist e histórico da ordem de serviço.",
      },
      { property: "og:title", content: "Detalhe da OS — NexCheck Oficina" },
      {
        property: "og:description",
        content: "Acompanhe status, peças, checklist e histórico da ordem de serviço.",
      },
    ],
  }),
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { id } = Route.useParams();
  const { data: order, isLoading } = useOrder(id);
  const { data: parts } = useParts(id);
  const { data: history } = useHistory(id);
  const { data: profiles } = useProfiles();
  const update = useUpdateOrder();

  if (isLoading || !order) {
    return (
      <AppShell title="Ordem de serviço">
        <div className="surface-card h-72 animate-pulse opacity-60" />
      </AppShell>
    );
  }

  const partsTotal = (parts ?? []).reduce(
    (sum, p) => sum + Number(p.unit_price) * Number(p.quantity),
    0,
  );

  const whatsappMessage = encodeURIComponent(
    `Olá ${order.clients?.name ?? ""}! Atualização da OS #${order.number} (${
      order.vehicles?.plate ?? ""
    }): ${STATUS_LABEL[order.status] ?? order.status}. Total atual: ${formatBRL(
      orderTotal(order),
    )}.`,
  );
  const whatsappNumber = (order.clients?.whatsapp || order.clients?.phone || "").replace(/\D/g, "");

  return (
    <AppShell
      title={`OS #${order.number}`}
      subtitle={`${order.vehicles?.plate ?? "—"} · ${order.clients?.name ?? "Cliente"}`}
      action={
        <Button asChild variant="ghost" size="sm">
          <Link to="/ordens">
            <ArrowLeft className="mr-1.5 size-4" /> Voltar
          </Link>
        </Button>
      }
    >
      <div className="surface-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={order.status} />
          <PriorityBadge priority={order.priority} />
          <span className="ml-auto font-display text-lg font-bold tabular-nums">
            {formatBRL(orderTotal(order))}
          </span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={order.status}
              onValueChange={(value) =>
                update.mutate({ id, patch: { status: value as typeof order.status } })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OS_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Prioridade</Label>
            <Select
              value={order.priority}
              onValueChange={(value) =>
                update.mutate({ id, patch: { priority: value as typeof order.priority } })
              }
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
              value={order.assignee_id ?? ""}
              onValueChange={(value) => update.mutate({ id, patch: { assignee_id: value } })}
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
          <div className="space-y-2">
            <Label htmlFor="services">Mão de obra (R$)</Label>
            <Input
              id="services"
              type="number"
              min={0}
              step="0.01"
              defaultValue={Number(order.total_services)}
              onBlur={(e) =>
                update.mutate({ id, patch: { total_services: Number(e.target.value || 0) } })
              }
            />
          </div>
        </div>

        <div className="mt-4 grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
          <span>Entrada: {formatDate(order.entry_at)}</span>
          <span>Previsão: {formatDate(order.due_at)}</span>
          <span>Peças: {formatBRL(partsTotal)}</span>
        </div>

        {whatsappNumber && (
          <Button asChild variant="outline" size="sm" className="mt-4">
            <a
              href={`https://wa.me/55${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="mr-1.5 size-4" /> Avisar cliente no WhatsApp
            </a>
          </Button>
        )}
      </div>

      <Tabs defaultValue="servico" className="mt-5">
        <TabsList className="no-scrollbar w-full justify-start overflow-x-auto">
          <TabsTrigger value="servico">Serviço</TabsTrigger>
          <TabsTrigger value="pecas">Peças</TabsTrigger>
          <TabsTrigger value="entrada">Check-in</TabsTrigger>
          <TabsTrigger value="saida">Check-out</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="servico" className="mt-4 space-y-4">
          <div className="surface-card p-4">
            <Label htmlFor="desc">Serviço solicitado</Label>
            <Textarea
              id="desc"
              className="mt-2"
              maxLength={1000}
              defaultValue={order.description ?? ""}
              onBlur={(e) => update.mutate({ id, patch: { description: e.target.value } })}
            />
          </div>
          <div className="surface-card p-4">
            <Label htmlFor="notes">Observações internas</Label>
            <Textarea
              id="notes"
              className="mt-2"
              maxLength={1000}
              defaultValue={order.notes ?? ""}
              onBlur={(e) => update.mutate({ id, patch: { notes: e.target.value } })}
            />
          </div>
          <div className="surface-card p-4">
            <Label htmlFor="due">Previsão de entrega</Label>
            <Input
              id="due"
              type="date"
              className="mt-2"
              defaultValue={order.due_at ? order.due_at.slice(0, 10) : ""}
              onChange={(e) =>
                update.mutate({
                  id,
                  patch: { due_at: e.target.value ? new Date(e.target.value).toISOString() : null },
                })
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="pecas" className="mt-4">
          <PartsSection orderId={id} />
        </TabsContent>

        <TabsContent value="entrada" className="mt-4">
          <ChecklistPanel orderId={id} type="entrada" />
        </TabsContent>

        <TabsContent value="saida" className="mt-4">
          <ChecklistPanel orderId={id} type="saida" />
        </TabsContent>

        <TabsContent value="historico" className="mt-4">
          {(history ?? []).length === 0 ? (
            <div className="surface-card flex flex-col items-center gap-2 p-10 text-center">
              <History className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Nenhuma alteração registrada ainda.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {history!.map((h) => (
                <div key={h.id} className="surface-card p-3.5">
                  <p className="text-sm">
                    <strong className="capitalize">{h.field}</strong>:{" "}
                    {STATUS_LABEL[h.old_value ?? ""] ?? h.old_value ?? "—"} →{" "}
                    {STATUS_LABEL[h.new_value ?? ""] ?? h.new_value ?? "—"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDateTime(h.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function PartsSection({ orderId }: { orderId: string }) {
  const qc = useQueryClient();
  const { data: parts } = useParts(orderId);
  const [form, setForm] = useState({ name: "", code: "", supplier: "", quantity: "1", price: "" });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["parts", orderId] });
    qc.invalidateQueries({ queryKey: ["order", orderId] });
    qc.invalidateQueries({ queryKey: ["orders"] });
  };

  const add = useMutation({
    mutationFn: async () => {
      if (!form.name.trim()) throw new Error("Informe o nome da peça.");
      const { error } = await supabase.from("order_parts").insert({
        order_id: orderId,
        name: form.name.trim(),
        code: form.code.trim() || null,
        supplier: form.supplier.trim() || null,
        quantity: Number(form.quantity || 1),
        unit_price: Number(form.price || 0),
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Peça adicionada");
      setForm({ name: "", code: "", supplier: "", quantity: "1", price: "" });
      invalidate();
    },
    onError: (e: Error) => toast.error("Erro", { description: e.message }),
  });

  return (
    <div className="space-y-4">
      <div className="surface-card p-4">
        <h3 className="font-display text-sm font-bold">Adicionar peça</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="p-name">Descrição *</Label>
            <Input
              id="p-name"
              maxLength={120}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-code">Código</Label>
            <Input
              id="p-code"
              maxLength={40}
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-sup">Fornecedor</Label>
            <Input
              id="p-sup"
              maxLength={80}
              value={form.supplier}
              onChange={(e) => setForm({ ...form, supplier: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-qty">Quantidade</Label>
            <Input
              id="p-qty"
              type="number"
              min={1}
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-price">Valor unitário (R$)</Label>
            <Input
              id="p-price"
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
        </div>
        <Button className="mt-4 w-full sm:w-auto" onClick={() => add.mutate()} disabled={add.isPending}>
          <Plus className="mr-1.5 size-4" /> Adicionar peça
        </Button>
      </div>

      {(parts ?? []).length === 0 ? (
        <div className="surface-card flex flex-col items-center gap-2 p-10 text-center">
          <Package className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nenhuma peça lançada. Enquanto houver peça não recebida, a OS fica em aguardando peças.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {parts!.map((p) => (
            <div key={p.id} className="surface-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {[p.code, p.supplier].filter(Boolean).join(" · ") || "Sem código"}
                  </p>
                </div>
                <PartStatusBadge status={p.status} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Select
                  value={p.status}
                  onValueChange={async (value) => {
                    const { error } = await supabase
                      .from("order_parts")
                      .update({ status: value as typeof p.status })
                      .eq("id", p.id);
                    if (error) toast.error("Erro", { description: error.message });
                    else invalidate();
                  }}
                >
                  <SelectTrigger className="h-9 w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PART_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-xs text-muted-foreground">
                  {p.quantity} × {formatBRL(Number(p.unit_price))}
                </span>
                <span className="ml-auto text-sm font-semibold tabular-nums">
                  {formatBRL(Number(p.unit_price) * Number(p.quantity))}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remover peça"
                  onClick={async () => {
                    await supabase.from("order_parts").delete().eq("id", p.id);
                    invalidate();
                  }}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="surface-card flex items-center gap-2 p-4">
        <ClipboardCheck className="size-4 text-primary" />
        <p className="text-xs text-muted-foreground">
          O total de peças da OS é recalculado automaticamente a cada lançamento.
        </p>
      </div>
    </div>
  );
}
