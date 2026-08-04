import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CalendarClock,
  Car,
  CheckCircle2,
  ClipboardList,
  Package,
  Wrench,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { EmptyState, PriorityBadge, SkeletonList, StatCard, StatusBadge } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/lib/data";
import { formatBRL, formatDateTime } from "@/lib/os";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — NexCheck Oficina" },
      {
        name: "description",
        content: "Visão geral da oficina: veículos no pátio, produção, peças pendentes e agenda.",
      },
      { property: "og:title", content: "Dashboard — NexCheck Oficina" },
      {
        property: "og:description",
        content: "Visão geral da oficina: veículos no pátio, produção, peças pendentes e agenda.",
      },
    ],
  }),
  component: DashboardPage,
});

const OPEN_STATUSES = ["finalizado", "entregue"];

function DashboardPage() {
  const { data, isLoading } = useDashboard();
  const orders = data?.orders ?? [];

  const open = orders.filter((o) => !OPEN_STATUSES.includes(o.status));
  const inProduction = orders.filter((o) =>
    ["em_producao", "em_montagem", "em_pintura", "em_polimento", "em_teste", "lavagem"].includes(
      o.status,
    ),
  );
  const waitingParts = orders.filter((o) => o.status === "aguardando_pecas");
  const waitingApproval = orders.filter((o) =>
    ["aguardando_orcamento", "orcamento_enviado", "aguardando_aprovacao"].includes(o.status),
  );
  const delivered = orders.filter((o) => o.status === "entregue");
  const revenue = orders
    .filter((o) => ["finalizado", "entregue"].includes(o.status))
    .reduce((sum, o) => sum + Number(o.total_value ?? 0), 0);

  return (
    <AppShell
      title="Dashboard"
      subtitle="Panorama operacional em tempo real"
      action={
        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link to="/ordens">Nova OS</Link>
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Veículos no pátio" value={open.length} icon={Car} hint="OS em aberto" />
        <StatCard
          label="Em produção"
          value={inProduction.length}
          icon={Wrench}
          accent="info"
          hint="Serviços em execução"
        />
        <StatCard
          label="Aguardando peças"
          value={waitingParts.length}
          icon={Package}
          accent="destructive"
          hint="Produção travada"
        />
        <StatCard
          label="Aguardando aprovação"
          value={waitingApproval.length}
          icon={AlertTriangle}
          accent="warning"
          hint="Orçamentos pendentes"
        />
        <StatCard
          label="Entregues"
          value={delivered.length}
          icon={CheckCircle2}
          accent="success"
          hint="Histórico total"
        />
        <StatCard
          label="Faturamento concluído"
          value={formatBRL(revenue)}
          icon={ClipboardList}
          hint="OS finalizadas e entregues"
        />
        <StatCard
          label="Equipe online"
          value={data?.staff.length ?? 0}
          icon={Wrench}
          accent="success"
        />
        <StatCard
          label="Agendamentos hoje"
          value={data?.appointments.length ?? 0}
          icon={CalendarClock}
          accent="info"
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-sm font-bold">Ordens recentes</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/ordens">Ver todas</Link>
            </Button>
          </div>
          {isLoading ? (
            <SkeletonList />
          ) : orders.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="Nenhuma ordem de serviço"
              description="Cadastre um cliente, o veículo e abra a primeira OS para começar."
              action={
                <Button asChild>
                  <Link to="/ordens">Criar primeira OS</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 6).map((o) => (
                <Link
                  key={o.id}
                  to="/ordens/$id"
                  params={{ id: o.id }}
                  className="surface-card block p-4 transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        OS #{o.number} · {o.vehicles?.plate ?? "sem placa"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {o.clients?.name ?? "Cliente"} ·{" "}
                        {[o.vehicles?.brand, o.vehicles?.model].filter(Boolean).join(" ")}
                      </p>
                    </div>
                    <PriorityBadge priority={o.priority} />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <StatusBadge status={o.status} />
                    <span className="text-xs font-semibold tabular-nums">
                      {formatBRL(Number(o.total_value ?? 0))}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-5">
          <div>
            <h2 className="mb-3 font-display text-sm font-bold">Agenda de hoje</h2>
            {(data?.appointments.length ?? 0) === 0 ? (
              <div className="surface-card p-4 text-sm text-muted-foreground">
                Nenhum agendamento para hoje.
              </div>
            ) : (
              <div className="space-y-2.5">
                {data!.appointments.map((a) => (
                  <div key={a.id} className="surface-card p-3.5">
                    <p className="text-sm font-semibold">{a.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatDateTime(a.starts_at)}
                      {a.clients?.name ? ` · ${a.clients.name}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-3 font-display text-sm font-bold">Últimos veículos</h2>
            {(data?.vehicles.length ?? 0) === 0 ? (
              <div className="surface-card p-4 text-sm text-muted-foreground">
                Nenhum veículo cadastrado.
              </div>
            ) : (
              <div className="space-y-2.5">
                {data!.vehicles.map((v) => (
                  <div key={v.id} className="surface-card flex items-center gap-3 p-3.5">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent">
                      <Car className="size-4.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{v.plate}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {[v.brand, v.model, v.year].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
