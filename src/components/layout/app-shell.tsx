import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Car,
  ClipboardList,
  Gauge,
  LogOut,
  Moon,
  Sun,
  Users,
  Wrench,
  Plus,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { initials } from "@/lib/os";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/ordens", label: "Ordens", icon: ClipboardList },
  { to: "/producao", label: "Produção", icon: Wrench },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/veiculos", label: "Veículos", icon: Car },
] as const;

function useDarkMode() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem("nexcheck-theme");
    const isDark = stored ? stored === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("nexcheck-theme", next ? "dark" : "light");
      return next;
    });
  };
  return { dark, toggle };
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="gradient-primary grid size-9 shrink-0 place-items-center rounded-xl shadow-glow">
        <Wrench className="size-4.5 text-primary-foreground" strokeWidth={2.5} />
      </div>
      {!compact && (
        <div className="min-w-0 leading-tight">
          <p className="truncate font-display text-sm font-bold">NexCheck</p>
          <p className="truncate text-[11px] text-muted-foreground">Oficina</p>
        </div>
      )}
    </div>
  );
}

export function AppShell({
  children,
  title,
  subtitle,
  action,
  userName,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  userName?: string | null;
}) {
  const { dark, toggle } = useDarkMode();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-sidebar px-3 py-5 lg:flex">
        <div className="px-2">
          <Brand />
        </div>
        <nav className="mt-7 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-primary/12 text-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                )}
              >
                <item.icon className="size-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="rounded-2xl border border-border bg-accent/40 p-3">
          <p className="text-xs font-semibold">Checklist digital</p>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
            Registre avarias, fotos e assinatura direto do celular.
          </p>
        </div>
      </aside>

      <div className="lg:pl-60">
        {/* Header */}
        <header className="glass sticky top-0 z-30 border-b border-border">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
            <div className="lg:hidden">
              <Brand compact />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-base font-bold sm:text-lg">{title}</h1>
              {subtitle && (
                <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {action}
              <Button variant="ghost" size="icon" onClick={toggle} aria-label="Alternar tema">
                {dark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Conta">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                        {initials(userName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="truncate">
                    {userName || "Minha conta"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 size-4" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-5 sm:px-6 lg:pb-10">
          {children}
        </main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="glass fixed inset-x-0 bottom-0 z-40 border-t border-border pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="grid grid-cols-5">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className={cn("size-5", active && "drop-shadow")} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function FloatingAction({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="gradient-primary fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow lg:hidden"
    >
      <Plus className="size-4" />
      {label}
    </Link>
  );
}
