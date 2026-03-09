import { useState } from "react";
import { LayoutDashboard, Calendar, Users, Settings, FolderKanban, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projeler", icon: FolderKanban },
  { id: "calendar", label: "Takvim", icon: Calendar },
  { id: "team", label: "Ekip", icon: Users },
  { id: "settings", label: "Ayarlar", icon: Settings },
];

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { profile, isAdmin } = useAuth();

  const initials = profile?.full_name
    ?.split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "?";

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className={cn("flex items-center h-14 px-4 border-b border-sidebar-border", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-sm text-sidebar-primary-foreground">ProTrack</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
              activeSection === item.id
                ? "bg-sidebar-accent text-sidebar-primary-foreground font-medium"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <item.icon size={18} className="shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {!collapsed && (
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-primary-foreground truncate">{profile?.full_name ?? "Kullanıcı"}</p>
              <p className="text-[11px] text-sidebar-foreground/50">{isAdmin ? "Admin" : "Üye"}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
