import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Camera,
  ClipboardList,
  Gauge,
  Package,
  PenLine,
  ShieldCheck,
  Smartphone,
  Wrench,
} from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NexCheck Oficina — Gestão completa para oficinas e auto centers" },
      {
        name: "description",
        content:
          "Ordens de serviço, checklist digital com fotos e assinatura, kanban de produção e controle de peças em um só sistema mobile first.",
      },
      { property: "og:title", content: "NexCheck Oficina — Gestão completa para oficinas e auto centers" },
      {
        property: "og:description",
        content:
          "Ordens de serviço, checklist digital com fotos e assinatura, kanban de produção e controle de peças em um só sistema mobile first.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: ClipboardList,
    title: "OS completa",
    text: "Numeração automática, status detalhado, prioridade, responsável e histórico de cada alteração.",
  },
  {
    icon: Camera,
    title: "Checklist com fotos",
    text: "Check-in e check-out com 17 itens, mapa de avarias, fotos das quatro laterais e nível de combustível.",
  },
  {
    icon: PenLine,
    title: "Assinatura digital",
    text: "Cliente e consultor assinam na tela do celular, com registro salvo junto ao checklist.",
  },
  {
    icon: Package,
    title: "Controle de peças",
    text: "Peça pendente trava a produção automaticamente e libera a OS quando tudo é recebido.",
  },
  {
    icon: Gauge,
    title: "Kanban de produção",
    text: "Arraste ordens entre análise, produção, pintura, polimento, teste e lavagem.",
  },
  {
    icon: ShieldCheck,
    title: "Acesso por função",
    text: "Permissões separadas por perfil da equipe, com dados protegidos no banco.",
  },
];

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-30 border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="gradient-primary grid size-9 place-items-center rounded-xl shadow-glow">
              <Wrench className="size-4.5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display text-sm font-bold">NexCheck Oficina</span>
          </div>
          <Button asChild size="sm">
            <Link to="/auth">Entrar</Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
          <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-primary-glow/15 blur-3xl" />
          <div className="relative mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-accent/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Smartphone className="size-3.5" /> Mobile first, feito para o pátio
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
              O sistema completo da <span className="text-gradient">recepção à entrega</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground">
              Oficinas mecânicas, funilarias, auto centers, elétricas e estética automotiva.
              Ordens de serviço, checklist digital, produção em kanban e controle de peças em um
              só lugar.
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg">
                <Link to="/auth">
                  Acessar o sistema <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="surface-card p-5">
                <div className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
                  <f.icon className="size-5" />
                </div>
                <h2 className="mt-4 font-display text-base font-bold">{f.title}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        NexCheck Oficina · Fase 1: núcleo operacional e checklist
      </footer>
    </div>
  );
}
