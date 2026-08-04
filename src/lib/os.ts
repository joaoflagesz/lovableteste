import type { Enums } from "@/integrations/supabase/types";

export type OsStatus = Enums<"os_status">;
export type OsPriority = Enums<"os_priority">;
export type PartStatus = Enums<"part_status">;

type Tone = "slate" | "blue" | "cyan" | "amber" | "green" | "violet" | "red";

export const OS_STATUSES: { value: OsStatus; label: string; tone: Tone }[] = [
  { value: "recebido", label: "Recebido", tone: "slate" },
  { value: "em_analise", label: "Em análise", tone: "slate" },
  { value: "aguardando_orcamento", label: "Aguardando orçamento", tone: "amber" },
  { value: "orcamento_enviado", label: "Orçamento enviado", tone: "amber" },
  { value: "aguardando_aprovacao", label: "Aguardando aprovação", tone: "amber" },
  { value: "aguardando_pecas", label: "Aguardando peças", tone: "red" },
  { value: "em_producao", label: "Em produção", tone: "blue" },
  { value: "em_montagem", label: "Em montagem", tone: "blue" },
  { value: "em_pintura", label: "Em pintura", tone: "violet" },
  { value: "em_polimento", label: "Em polimento", tone: "violet" },
  { value: "em_teste", label: "Em teste", tone: "cyan" },
  { value: "lavagem", label: "Lavagem", tone: "cyan" },
  { value: "finalizado", label: "Finalizado", tone: "green" },
  { value: "entregue", label: "Entregue", tone: "green" },
];

export const STATUS_LABEL: Record<string, string> = Object.fromEntries(
  OS_STATUSES.map((s) => [s.value, s.label]),
);

export const TONE_CLASS: Record<Tone, string> = {
  slate: "bg-muted text-muted-foreground border-border",
  blue: "bg-primary/12 text-primary border-primary/25",
  cyan: "bg-info/15 text-info border-info/30",
  amber: "bg-warning/15 text-warning border-warning/30",
  green: "bg-success/15 text-success border-success/30",
  violet: "bg-chart-5/15 text-chart-5 border-chart-5/30",
  red: "bg-destructive/15 text-destructive border-destructive/30",
};

export function statusTone(status: string): string {
  const found = OS_STATUSES.find((s) => s.value === status);
  return TONE_CLASS[found?.tone ?? "slate"];
}

export const PRIORITIES: { value: OsPriority; label: string; className: string }[] = [
  { value: "baixa", label: "Baixa", className: "bg-muted text-muted-foreground border-border" },
  { value: "normal", label: "Normal", className: "bg-info/15 text-info border-info/30" },
  { value: "alta", label: "Alta", className: "bg-warning/15 text-warning border-warning/30" },
  {
    value: "urgente",
    label: "Urgente",
    className: "bg-destructive/15 text-destructive border-destructive/30",
  },
];

export function priorityMeta(value: string) {
  return PRIORITIES.find((p) => p.value === value) ?? PRIORITIES[1]!;
}

export const PART_STATUSES: { value: PartStatus; label: string }[] = [
  { value: "nao_solicitada", label: "Não solicitada" },
  { value: "solicitada", label: "Solicitada" },
  { value: "comprada", label: "Comprada" },
  { value: "em_transporte", label: "Em transporte" },
  { value: "recebida", label: "Recebida" },
];

export const PART_STATUS_LABEL: Record<string, string> = Object.fromEntries(
  PART_STATUSES.map((s) => [s.value, s.label]),
);

export const ROLE_OPTIONS = [
  "administrador",
  "gerente",
  "consultor",
  "mecanico",
  "funileiro",
  "pintor",
  "lavador",
] as const;

export const PHOTO_SLOTS = [
  { key: "frente", label: "Frente" },
  { key: "traseira", label: "Traseira" },
  { key: "lado_esquerdo", label: "Lado esquerdo" },
  { key: "lado_direito", label: "Lado direito" },
] as const;

export const CHECKLIST_ITEMS = [
  { key: "estepe", label: "Estepe" },
  { key: "macaco", label: "Macaco" },
  { key: "chave_roda", label: "Chave de roda" },
  { key: "manual", label: "Manual" },
  { key: "documento", label: "Documento" },
  { key: "som", label: "Som" },
  { key: "multimidia", label: "Multimídia" },
  { key: "rodas", label: "Rodas" },
  { key: "pneus", label: "Pneus" },
  { key: "farois", label: "Faróis" },
  { key: "lanternas", label: "Lanternas" },
  { key: "retrovisores", label: "Retrovisores" },
  { key: "vidros", label: "Vidros" },
  { key: "para_brisa", label: "Para-brisa" },
  { key: "bancos", label: "Bancos" },
  { key: "painel", label: "Painel" },
  { key: "acessorios", label: "Acessórios" },
] as const;

export const FUEL_OPTIONS = ["Flex", "Gasolina", "Etanol", "Diesel", "GNV", "Elétrico", "Híbrido"];

export function formatBRL(value: number | null | undefined) {
  return (value ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatPlate(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR");
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function initials(name: string | null | undefined) {
  if (!name) return "??";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]!.toUpperCase())
    .join("");
}
