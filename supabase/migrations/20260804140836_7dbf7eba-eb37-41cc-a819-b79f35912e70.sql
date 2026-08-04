-- ENUMS
CREATE TYPE public.app_role AS ENUM ('administrador','gerente','consultor','mecanico','funileiro','pintor','lavador');
CREATE TYPE public.os_status AS ENUM ('recebido','em_analise','aguardando_orcamento','orcamento_enviado','aguardando_aprovacao','aguardando_pecas','em_producao','em_montagem','em_pintura','em_polimento','em_teste','lavagem','finalizado','entregue');
CREATE TYPE public.os_priority AS ENUM ('baixa','normal','alta','urgente');
CREATE TYPE public.part_status AS ENUM ('nao_solicitada','solicitada','comprada','em_transporte','recebida');
CREATE TYPE public.checklist_type AS ENUM ('entrada','saida');

-- UTIL
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  job_title TEXT,
  is_online BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_read" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "roles_read" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "roles_admin_manage" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'administrador')) WITH CHECK (public.has_role(auth.uid(),'administrador'));

-- new user -> profile + first user becomes admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)), NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;

  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'administrador') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id,'administrador') ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id,'consultor') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- CLIENTS
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  doc TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  zip TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clients_staff_all" ON public.clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_clients_name ON public.clients (lower(name));

-- VEHICLES
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  plate TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  year TEXT,
  color TEXT,
  chassis TEXT,
  renavam TEXT,
  km INTEGER,
  fuel TEXT,
  engine TEXT,
  transmission TEXT,
  city TEXT,
  state TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicles TO authenticated;
GRANT ALL ON public.vehicles TO service_role;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vehicles_staff_all" ON public.vehicles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_vehicles_updated BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE UNIQUE INDEX idx_vehicles_plate ON public.vehicles (upper(plate));

-- SERVICE ORDERS
CREATE SEQUENCE public.service_order_number_seq START 1000;
CREATE TABLE public.service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number INTEGER NOT NULL DEFAULT nextval('public.service_order_number_seq') UNIQUE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  status public.os_status NOT NULL DEFAULT 'recebido',
  priority public.os_priority NOT NULL DEFAULT 'normal',
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  description TEXT,
  notes TEXT,
  entry_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  total_services NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_parts NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_orders TO authenticated;
GRANT ALL ON public.service_orders TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.service_order_number_seq TO authenticated;
GRANT ALL ON SEQUENCE public.service_order_number_seq TO service_role;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "os_staff_all" ON public.service_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_os_updated BEFORE UPDATE ON public.service_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_os_status ON public.service_orders (status);

-- PARTS
CREATE TABLE public.order_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.service_orders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  manufacturer TEXT,
  supplier TEXT,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  status public.part_status NOT NULL DEFAULT 'nao_solicitada',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_parts TO authenticated;
GRANT ALL ON public.order_parts TO service_role;
ALTER TABLE public.order_parts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "parts_staff_all" ON public.order_parts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_parts_updated BEFORE UPDATE ON public.order_parts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_parts_order ON public.order_parts (order_id);

-- automation: all parts received -> em_producao
CREATE OR REPLACE FUNCTION public.parts_auto_production()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  target UUID := COALESCE(NEW.order_id, OLD.order_id);
  pending INTEGER;
  total INTEGER;
BEGIN
  SELECT count(*) FILTER (WHERE status <> 'recebida'), count(*) INTO pending, total
  FROM public.order_parts WHERE order_id = target;

  IF total > 0 AND pending = 0 THEN
    UPDATE public.service_orders
    SET status = 'em_producao'
    WHERE id = target AND status IN ('aguardando_pecas','recebido','em_analise','aguardando_aprovacao','orcamento_enviado','aguardando_orcamento');
  END IF;
  RETURN NULL;
END; $$;
CREATE TRIGGER trg_parts_auto_production AFTER INSERT OR UPDATE OR DELETE ON public.order_parts
FOR EACH ROW EXECUTE FUNCTION public.parts_auto_production();

-- CHECKLISTS
CREATE TABLE public.checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.service_orders(id) ON DELETE CASCADE,
  type public.checklist_type NOT NULL,
  km INTEGER,
  fuel_level INTEGER,
  items JSONB NOT NULL DEFAULT '{}'::jsonb,
  damage_marks JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  client_signature TEXT,
  consultant_signature TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (order_id, type)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.checklists TO authenticated;
GRANT ALL ON public.checklists TO service_role;
ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "checklists_staff_all" ON public.checklists FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_checklists_updated BEFORE UPDATE ON public.checklists FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- MEDIA
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.service_orders(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  checklist_id UUID REFERENCES public.checklists(id) ON DELETE CASCADE,
  slot TEXT,
  storage_path TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'photo',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media TO authenticated;
GRANT ALL ON public.media TO service_role;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "media_staff_all" ON public.media FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX idx_media_checklist ON public.media (checklist_id);

-- HISTORY
CREATE TABLE public.order_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.service_orders(id) ON DELETE CASCADE,
  field TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.order_history TO authenticated;
GRANT ALL ON public.order_history TO service_role;
ALTER TABLE public.order_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "history_read" ON public.order_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "history_insert" ON public.order_history FOR INSERT TO authenticated WITH CHECK (true);
CREATE INDEX idx_history_order ON public.order_history (order_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.log_order_changes()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.order_history (order_id, field, old_value, new_value, changed_by)
    VALUES (NEW.id,'status',OLD.status::text,NEW.status::text,auth.uid());
  END IF;
  IF NEW.priority IS DISTINCT FROM OLD.priority THEN
    INSERT INTO public.order_history (order_id, field, old_value, new_value, changed_by)
    VALUES (NEW.id,'prioridade',OLD.priority::text,NEW.priority::text,auth.uid());
  END IF;
  IF NEW.assignee_id IS DISTINCT FROM OLD.assignee_id THEN
    INSERT INTO public.order_history (order_id, field, old_value, new_value, changed_by)
    VALUES (NEW.id,'responsavel',OLD.assignee_id::text,NEW.assignee_id::text,auth.uid());
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_os_history AFTER UPDATE ON public.service_orders FOR EACH ROW EXECUTE FUNCTION public.log_order_changes();

-- AGENDA
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.service_orders(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'servico',
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "appointments_staff_all" ON public.appointments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_appointments_updated BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();