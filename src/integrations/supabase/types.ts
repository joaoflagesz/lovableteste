export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          client_id: string | null
          created_at: string
          created_by: string | null
          ends_at: string | null
          id: string
          kind: string
          notes: string | null
          order_id: string | null
          starts_at: string
          title: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: string
          kind?: string
          notes?: string | null
          order_id?: string | null
          starts_at: string
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: string
          kind?: string
          notes?: string | null
          order_id?: string | null
          starts_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      checklists: {
        Row: {
          client_signature: string | null
          consultant_signature: string | null
          created_at: string
          created_by: string | null
          damage_marks: Json
          fuel_level: number | null
          id: string
          items: Json
          km: number | null
          notes: string | null
          order_id: string
          type: Database["public"]["Enums"]["checklist_type"]
          updated_at: string
        }
        Insert: {
          client_signature?: string | null
          consultant_signature?: string | null
          created_at?: string
          created_by?: string | null
          damage_marks?: Json
          fuel_level?: number | null
          id?: string
          items?: Json
          km?: number | null
          notes?: string | null
          order_id: string
          type: Database["public"]["Enums"]["checklist_type"]
          updated_at?: string
        }
        Update: {
          client_signature?: string | null
          consultant_signature?: string | null
          created_at?: string
          created_by?: string | null
          damage_marks?: Json
          fuel_level?: number | null
          id?: string
          items?: Json
          km?: number | null
          notes?: string | null
          order_id?: string
          type?: Database["public"]["Enums"]["checklist_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklists_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          created_by: string | null
          doc: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          state: string | null
          updated_at: string
          whatsapp: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          created_by?: string | null
          doc?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
          whatsapp?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          created_by?: string | null
          doc?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
          whatsapp?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      media: {
        Row: {
          checklist_id: string | null
          created_at: string
          created_by: string | null
          id: string
          kind: string
          order_id: string | null
          slot: string | null
          storage_path: string
          vehicle_id: string | null
        }
        Insert: {
          checklist_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          order_id?: string | null
          slot?: string | null
          storage_path: string
          vehicle_id?: string | null
        }
        Update: {
          checklist_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          order_id?: string | null
          slot?: string | null
          storage_path?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_history: {
        Row: {
          changed_by: string | null
          created_at: string
          field: string
          id: string
          new_value: string | null
          old_value: string | null
          order_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          field: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          order_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          field?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_parts: {
        Row: {
          code: string | null
          created_at: string
          id: string
          manufacturer: string | null
          name: string
          order_id: string
          quantity: number
          status: Database["public"]["Enums"]["part_status"]
          supplier: string | null
          unit_price: number
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          manufacturer?: string | null
          name: string
          order_id: string
          quantity?: number
          status?: Database["public"]["Enums"]["part_status"]
          supplier?: string | null
          unit_price?: number
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          manufacturer?: string | null
          name?: string
          order_id?: string
          quantity?: number
          status?: Database["public"]["Enums"]["part_status"]
          supplier?: string | null
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_parts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          is_online: boolean
          job_title: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id: string
          is_online?: boolean
          job_title?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          is_online?: boolean
          job_title?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      service_orders: {
        Row: {
          assignee_id: string | null
          client_id: string | null
          created_at: string
          created_by: string | null
          delivered_at: string | null
          description: string | null
          due_at: string | null
          entry_at: string
          id: string
          notes: string | null
          number: number
          priority: Database["public"]["Enums"]["os_priority"]
          status: Database["public"]["Enums"]["os_status"]
          total_parts: number
          total_services: number
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          assignee_id?: string | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          delivered_at?: string | null
          description?: string | null
          due_at?: string | null
          entry_at?: string
          id?: string
          notes?: string | null
          number?: number
          priority?: Database["public"]["Enums"]["os_priority"]
          status?: Database["public"]["Enums"]["os_status"]
          total_parts?: number
          total_services?: number
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          assignee_id?: string | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          delivered_at?: string | null
          description?: string | null
          due_at?: string | null
          entry_at?: string
          id?: string
          notes?: string | null
          number?: number
          priority?: Database["public"]["Enums"]["os_priority"]
          status?: Database["public"]["Enums"]["os_status"]
          total_parts?: number
          total_services?: number
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          brand: string | null
          chassis: string | null
          city: string | null
          client_id: string | null
          color: string | null
          created_at: string
          engine: string | null
          fuel: string | null
          id: string
          km: number | null
          model: string | null
          notes: string | null
          plate: string
          renavam: string | null
          state: string | null
          transmission: string | null
          updated_at: string
          year: string | null
        }
        Insert: {
          brand?: string | null
          chassis?: string | null
          city?: string | null
          client_id?: string | null
          color?: string | null
          created_at?: string
          engine?: string | null
          fuel?: string | null
          id?: string
          km?: number | null
          model?: string | null
          notes?: string | null
          plate: string
          renavam?: string | null
          state?: string | null
          transmission?: string | null
          updated_at?: string
          year?: string | null
        }
        Update: {
          brand?: string | null
          chassis?: string | null
          city?: string | null
          client_id?: string | null
          color?: string | null
          created_at?: string
          engine?: string | null
          fuel?: string | null
          id?: string
          km?: number | null
          model?: string | null
          notes?: string | null
          plate?: string
          renavam?: string | null
          state?: string | null
          transmission?: string | null
          updated_at?: string
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "administrador"
        | "gerente"
        | "consultor"
        | "mecanico"
        | "funileiro"
        | "pintor"
        | "lavador"
      checklist_type: "entrada" | "saida"
      os_priority: "baixa" | "normal" | "alta" | "urgente"
      os_status:
        | "recebido"
        | "em_analise"
        | "aguardando_orcamento"
        | "orcamento_enviado"
        | "aguardando_aprovacao"
        | "aguardando_pecas"
        | "em_producao"
        | "em_montagem"
        | "em_pintura"
        | "em_polimento"
        | "em_teste"
        | "lavagem"
        | "finalizado"
        | "entregue"
      part_status:
        | "nao_solicitada"
        | "solicitada"
        | "comprada"
        | "em_transporte"
        | "recebida"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "administrador",
        "gerente",
        "consultor",
        "mecanico",
        "funileiro",
        "pintor",
        "lavador",
      ],
      checklist_type: ["entrada", "saida"],
      os_priority: ["baixa", "normal", "alta", "urgente"],
      os_status: [
        "recebido",
        "em_analise",
        "aguardando_orcamento",
        "orcamento_enviado",
        "aguardando_aprovacao",
        "aguardando_pecas",
        "em_producao",
        "em_montagem",
        "em_pintura",
        "em_polimento",
        "em_teste",
        "lavagem",
        "finalizado",
        "entregue",
      ],
      part_status: [
        "nao_solicitada",
        "solicitada",
        "comprada",
        "em_transporte",
        "recebida",
      ],
    },
  },
} as const
