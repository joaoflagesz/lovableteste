import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Phone, Plus, Search, UserRound, Users } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useClients } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes — NexCheck Oficina" },
      {
        name: "description",
        content: "Cadastro completo de clientes da oficina com contato, documento e endereço.",
      },
      { property: "og:title", content: "Clientes — NexCheck Oficina" },
      {
        property: "og:description",
        content: "Cadastro completo de clientes da oficina com contato, documento e endereço.",
      },
    ],
  }),
  component: ClientsPage,
});

function ClientsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useClients(search);

  return (
    <AppShell
      title="Clientes"
      subtitle={`${data?.length ?? 0} cadastrados`}
      action={<NewClientDialog />}
    >
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, telefone, CPF/CNPJ..."
          className="pl-9"
          maxLength={80}
        />
      </div>

      {isLoading ? (
        <SkeletonList />
      ) : (data?.length ?? 0) === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum cliente encontrado"
          description="Cadastre o primeiro cliente para vincular veículos e abrir ordens de serviço."
          action={<NewClientDialog />}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {data!.map((c) => (
            <div key={c.id} className="surface-card p-4">
              <div className="flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
                  <UserRound className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {[c.doc, c.city].filter(Boolean).join(" · ") || "Sem documento"}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.phone && (
                  <a
                    href={`tel:${c.phone}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-2.5 py-1.5 text-xs font-medium"
                  >
                    <Phone className="size-3.5" /> {c.phone}
                  </a>
                )}
                {c.whatsapp && (
                  <a
                    href={`https://wa.me/55${c.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-success/15 px-2.5 py-1.5 text-xs font-medium text-success"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}

export function NewClientDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
    doc: "",
    city: "",
    state: "",
    address: "",
    notes: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!form.name.trim()) throw new Error("Informe o nome do cliente.");
      const { error } = await supabase.from("clients").insert({
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        whatsapp: form.whatsapp.trim() || null,
        email: form.email.trim() || null,
        doc: form.doc.trim() || null,
        city: form.city.trim() || null,
        state: form.state.trim() || null,
        address: form.address.trim() || null,
        notes: form.notes.trim() || null,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Cliente cadastrado");
      qc.invalidateQueries({ queryKey: ["clients"] });
      setOpen(false);
      setForm({
        name: "",
        phone: "",
        whatsapp: "",
        email: "",
        doc: "",
        city: "",
        state: "",
        address: "",
        notes: "",
      });
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
          <DialogTitle>Novo cliente</DialogTitle>
          <DialogDescription>Dados básicos para contato e faturamento.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="c-name">Nome / Razão social *</Label>
            <Input
              id="c-name"
              maxLength={120}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-doc">CPF / CNPJ</Label>
            <Input
              id="c-doc"
              maxLength={20}
              value={form.doc}
              onChange={(e) => setForm({ ...form, doc: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-phone">Telefone</Label>
            <Input
              id="c-phone"
              maxLength={20}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-wa">WhatsApp</Label>
            <Input
              id="c-wa"
              maxLength={20}
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-email">E-mail</Label>
            <Input
              id="c-email"
              type="email"
              maxLength={120}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-city">Cidade</Label>
            <Input
              id="c-city"
              maxLength={60}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-state">UF</Label>
            <Input
              id="c-state"
              maxLength={2}
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="c-address">Endereço</Label>
            <Input
              id="c-address"
              maxLength={160}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="c-notes">Observações</Label>
            <Textarea
              id="c-notes"
              maxLength={500}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="w-full sm:w-auto"
          >
            Salvar cliente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
