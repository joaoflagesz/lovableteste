import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Client = Tables<"clients">;
export type Vehicle = Tables<"vehicles">;
export type ServiceOrder = Tables<"service_orders">;
export type OrderPart = Tables<"order_parts">;
export type Checklist = Tables<"checklists">;
export type Media = Tables<"media">;
export type Profile = Tables<"profiles">;
export type Appointment = Tables<"appointments">;

export type OrderWithRelations = ServiceOrder & {
  clients: Pick<Client, "id" | "name" | "phone" | "whatsapp"> | null;
  vehicles: Pick<Vehicle, "id" | "plate" | "brand" | "model" | "year" | "color"> | null;
};

const ORDER_SELECT =
  "*, clients(id,name,phone,whatsapp), vehicles(id,plate,brand,model,year,color)";

function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () =>
      unwrap(await supabase.from("profiles").select("*").order("full_name")) as Profile[],
  });
}

export function useMyRoles() {
  return useQuery({
    queryKey: ["my-roles"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return [] as string[];
      const rows = unwrap(
        await supabase.from("user_roles").select("role").eq("user_id", auth.user.id),
      ) as { role: string }[];
      return rows.map((r) => r.role);
    },
  });
}

export function useClients(search = "") {
  return useQuery({
    queryKey: ["clients", search],
    queryFn: async () => {
      let q = supabase.from("clients").select("*").order("created_at", { ascending: false });
      if (search.trim()) {
        const term = `%${search.trim()}%`;
        q = q.or(`name.ilike.${term},phone.ilike.${term},doc.ilike.${term},email.ilike.${term}`);
      }
      return unwrap(await q.limit(200)) as Client[];
    },
  });
}

export function useVehicles(search = "") {
  return useQuery({
    queryKey: ["vehicles", search],
    queryFn: async () => {
      let q = supabase
        .from("vehicles")
        .select("*, clients(id,name)")
        .order("created_at", { ascending: false });
      if (search.trim()) {
        const term = `%${search.trim()}%`;
        q = q.or(
          `plate.ilike.${term},brand.ilike.${term},model.ilike.${term},chassis.ilike.${term}`,
        );
      }
      return unwrap(await q.limit(200)) as (Vehicle & { clients: { id: string; name: string } | null })[];
    },
  });
}

export function useOrders(search = "") {
  return useQuery({
    queryKey: ["orders", search],
    queryFn: async () => {
      const rows = unwrap(
        await supabase
          .from("service_orders")
          .select(ORDER_SELECT)
          .order("created_at", { ascending: false })
          .limit(400),
      ) as OrderWithRelations[];
      const term = search.trim().toLowerCase();
      if (!term) return rows;
      return rows.filter((o) =>
        [
          String(o.number),
          o.clients?.name,
          o.clients?.phone,
          o.vehicles?.plate,
          o.vehicles?.model,
          o.vehicles?.brand,
          o.description,
        ]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(term)),
      );
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () =>
      unwrap(
        await supabase.from("service_orders").select(ORDER_SELECT).eq("id", id).single(),
      ) as OrderWithRelations,
    enabled: Boolean(id),
  });
}

export function useParts(orderId: string) {
  return useQuery({
    queryKey: ["parts", orderId],
    queryFn: async () =>
      unwrap(
        await supabase
          .from("order_parts")
          .select("*")
          .eq("order_id", orderId)
          .order("created_at"),
      ) as OrderPart[],
    enabled: Boolean(orderId),
  });
}

export function useHistory(orderId: string) {
  return useQuery({
    queryKey: ["history", orderId],
    queryFn: async () =>
      unwrap(
        await supabase
          .from("order_history")
          .select("*")
          .eq("order_id", orderId)
          .order("created_at", { ascending: false }),
      ) as Tables<"order_history">[],
    enabled: Boolean(orderId),
  });
}

export function useChecklist(orderId: string, type: "entrada" | "saida") {
  return useQuery({
    queryKey: ["checklist", orderId, type],
    queryFn: async () => {
      const rows = unwrap(
        await supabase.from("checklists").select("*").eq("order_id", orderId).eq("type", type),
      ) as Checklist[];
      return rows[0] ?? null;
    },
    enabled: Boolean(orderId),
  });
}

export function useChecklistMedia(checklistId: string | undefined) {
  return useQuery({
    queryKey: ["checklist-media", checklistId],
    queryFn: async () =>
      unwrap(
        await supabase
          .from("media")
          .select("*")
          .eq("checklist_id", checklistId!)
          .order("created_at"),
      ) as Media[],
    enabled: Boolean(checklistId),
  });
}

export function useAppointments() {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: async () =>
      unwrap(
        await supabase
          .from("appointments")
          .select("*, clients(id,name)")
          .order("starts_at")
          .limit(300),
      ) as (Appointment & { clients: { id: string; name: string } | null })[],
  });
}

export function useUpdateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<ServiceOrder> }) => {
      const { error } = await supabase.from("service_orders").update(patch).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["order", vars.id] });
      qc.invalidateQueries({ queryKey: ["history", vars.id] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const orders = unwrap(
        await supabase
          .from("service_orders")
          .select(ORDER_SELECT)
          .order("created_at", { ascending: false })
          .limit(500),
      ) as OrderWithRelations[];

      const vehicles = unwrap(
        await supabase
          .from("vehicles")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6),
      ) as Vehicle[];

      const appointments = unwrap(
        await supabase
          .from("appointments")
          .select("*, clients(id,name)")
          .gte("starts_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
          .lte("starts_at", new Date(new Date().setHours(23, 59, 59, 999)).toISOString())
          .order("starts_at"),
      ) as (Appointment & { clients: { id: string; name: string } | null })[];

      const staff = unwrap(
        await supabase.from("profiles").select("*").eq("is_online", true),
      ) as Profile[];

      return { orders, vehicles, appointments, staff };
    },
  });
}
