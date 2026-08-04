import { createFileRoute, Link } from "@tanstack/react-router";
import { Wrench } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { EmptyState, PriorityBadge } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { useOrders, useUpdateOrder, type OrderWithRelations } from "@/lib/data";
import { OS_STATUSES, formatBRL, orderTotal, statusTone } from "@/lib/os";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/producao")({
  head: () => ({
    meta: [
      { title: "Produção — NexCheck Oficina" },
      {
        name: "description",
        content: "Kanban de produção da oficina: arraste as ordens entre as etapas do fluxo.",
      },
      { property: "og:title", content: "Produção — NexCheck Oficina" },
      {
        property: "og:description",
        content: "Kanban de produção da oficina: arraste as ordens entre as etapas do fluxo.",
      },
    ],
  }),
  component: KanbanPage,
});

const COLUMNS = OS_STATUSES.filter((s) => s.value !== "entregue");

function KanbanPage() {
  const { data, isLoading } = useOrders("");
  const update = useUpdateOrder();

  const grouped = COLUMNS.map((col) => ({
    ...col,
    orders: (data ?? []).filter((o) => o.status === col.value),
  }));

  return (
    <AppShell
      title="Produção"
      subtitle="Arraste as ordens entre as etapas do fluxo"
      action={
        <Button asChild size="sm" variant="ghost">
          <Link to="/ordens">Lista</Link>
        </Button>
      }
    >
      {isLoading ? (
        <div className="surface-card h-72 animate-pulse opacity-60" />
      ) : (data ?? []).length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="Sem ordens em produção"
          description="Abra uma ordem de serviço para acompanhar as etapas no kanban."
          action={
            <Button asChild>
              <Link to="/ordens">Ir para ordens</Link>
            </Button>
          }
        />
      ) : (
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
          {grouped.map((col) => (
            <div
              key={col.value}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = e.dataTransfer.getData("text/plain");
                if (id) update.mutate({ id, patch: { status: col.value } });
              }}
              className="flex w-64 shrink-0 flex-col rounded-2xl border border-border bg-accent/25 p-2.5"
            >
              <div className="flex items-center justify-between px-1 pb-2.5">
                <span
                  className={cn(
                    "rounded-lg border px-2 py-1 text-[11px] font-semibold",
                    statusTone(col.value),
                  )}
                >
                  {col.label}
                </span>
                <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                  {col.orders.length}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {col.orders.map((o) => (
                  <KanbanCard key={o.id} order={o} />
                ))}
                {col.orders.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border py-6 text-center text-[11px] text-muted-foreground">
                    Solte uma OS aqui
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}

function KanbanCard({ order }: { order: OrderWithRelations }) {
  return (
    <Link
      to="/ordens/$id"
      params={{ id: order.id }}
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", order.id)}
      className="surface-card block cursor-grab p-3 active:cursor-grabbing"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-xs font-bold">OS #{order.number}</span>
        <PriorityBadge priority={order.priority} />
      </div>
      <p className="mt-1.5 truncate text-xs font-semibold">{order.vehicles?.plate ?? "—"}</p>
      <p className="truncate text-[11px] text-muted-foreground">
        {[order.vehicles?.brand, order.vehicles?.model].filter(Boolean).join(" ") ||
          order.clients?.name ||
          "—"}
      </p>
      <p className="mt-2 text-[11px] font-semibold tabular-nums">{formatBRL(orderTotal(order))}</p>
    </Link>
  );
}
