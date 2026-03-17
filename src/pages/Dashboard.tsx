import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTasks, type TaskRow } from "@/hooks/useTasks";
import { useTeams } from "@/hooks/useTeams";
import { AppSidebar } from "@/components/AppSidebar";
import { TaskDetailDrawer } from "@/components/TaskDetailDrawer";
import { CalendarSection } from "@/components/CalendarSection";
import { TeamSection } from "@/components/TeamSection";
import { SettingsSection } from "@/components/SettingsSection";
import { LeaveSection } from "@/components/LeaveSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { PerformanceIndicator } from "@/components/PerformanceIndicator";
import { WeeklyReportsSection } from "@/components/WeeklyReportsSection";
import { DashboardStats, type DashboardFilter } from "@/components/DashboardStats";
import { TaskTable } from "@/components/TaskTable";
import { NewTaskForm } from "@/components/NewTaskForm";
import { ReminderDialog } from "@/components/ReminderDialog";
import { RemindersPopover } from "@/components/RemindersPopover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { exportTasksToExcel, parseExcelFile } from "@/lib/excel";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Download, Upload, Search, LogOut, Send } from "lucide-react";

export default function Dashboard() {
  const { profile, isAdmin, signOut } = useAuth();
  const { tasks, isLoading, addTask, refetch } = useTasks();
  const { data: teams } = useTeams();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskRow | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dashboardFilter, setDashboardFilter] = useState<DashboardFilter>({ type: "all", value: "all" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredTasks = tasks.filter(t => {
    if (searchQuery && !t.project_or_request.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterStatus !== "all" && t.status !== filterStatus) return false;

    // Dashboard card filters
    if (dashboardFilter.type === "status") {
      if (dashboardFilter.value === "overdue") {
        if (t.status === "tamamlandi" || !t.estimated_completion) return false;
        return new Date(t.estimated_completion) < new Date();
      }
      if (t.status !== dashboardFilter.value) return false;
    }
    if (dashboardFilter.type === "team" && t.team_id !== dashboardFilter.value) return false;

    return true;
  });

  const handleExport = () => {
    if (filteredTasks.length === 0) {
      toast({ title: "Uyarı", description: "Dışa aktarılacak görev yok.", variant: "destructive" });
      return;
    }
    const teamName = teams?.find(t => t.id === profile?.team_id)?.name ?? "Görevler";
    exportTasksToExcel(filteredTasks, teamName);
    toast({ title: "Başarılı", description: "Excel dosyası indirildi." });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.team_id) return;
    try {
      const imported = await parseExcelFile(file);
      for (const task of imported) {
        await addTask.mutateAsync({
          ...task,
          team_id: profile.team_id,
          created_by: profile.user_id,
        });
      }
      toast({ title: "Başarılı", description: `${imported.length} görev içe aktarıldı.` });
      refetch();
    } catch (err) {
      toast({ title: "Hata", description: "Excel dosyası okunamadı.", variant: "destructive" });
    }
    e.target.value = "";
  };

  const activeFilterLabel = (() => {
    if (dashboardFilter.type === "all") return null;
    if (dashboardFilter.type === "status") {
      const labels: Record<string, string> = {
        tamamlandi: "Tamamlanan",
        devam_ediyor: "Devam Eden",
        overdue: "Gecikmiş",
      };
      return labels[dashboardFilter.value] ?? dashboardFilter.value;
    }
    if (dashboardFilter.type === "team") {
      return teams?.find(t => t.id === dashboardFilter.value)?.name ?? "Takım";
    }
    return null;
  })();

  const renderSection = () => {
    switch (activeSection) {
      case "projects": return <ProjectsSection />;
      case "calendar": return <CalendarSection />;
      case "team": return <TeamSection />;
      case "performance": return isAdmin ? <PerformanceIndicator /> : null;
      case "reports": return isAdmin ? <WeeklyReportsSection /> : null;
      case "settings": return <SettingsSection />;
      default:
        return (
          <div className="flex-1 overflow-hidden flex flex-col">
            <header className="h-14 border-b bg-card flex items-center justify-between px-4 md:px-6 shrink-0">
              <div className="relative w-full max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Görev ara..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-secondary/50 border-transparent focus:border-primary/30 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-9 w-40 text-sm">
                    <SelectValue placeholder="Durum filtresi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Durumlar</SelectItem>
                    <SelectItem value="devam_ediyor">Devam Ediyor</SelectItem>
                    <SelectItem value="tamamlandi">Tamamlandı</SelectItem>
                    <SelectItem value="beklemede">Beklemede</SelectItem>
                    <SelectItem value="iptal">İptal</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
                  <Download size={14} /> Excel
                </Button>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-1.5">
                  <Upload size={14} /> İçe Aktar
                </Button>
                <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImport} />
                {isAdmin && (
                  <Button variant="outline" size="sm" onClick={() => setReminderOpen(true)} className="gap-1.5">
                    <Send size={14} /> Hatırlatma
                  </Button>
                )}
                <RemindersPopover />
                <Button size="sm" onClick={() => setNewTaskOpen(true)} className="gap-1.5">
                  <Plus size={14} /> Yeni Görev
                </Button>
                <Button variant="ghost" size="icon" onClick={signOut} title="Çıkış Yap" className="text-muted-foreground hover:text-foreground">
                  <LogOut size={18} />
                </Button>
              </div>
            </header>

            <div className="px-4 md:px-6 pt-4 pb-3 shrink-0">
              <h1 className="text-xl font-bold">
                {isAdmin ? "Tüm Takımlar - Görev Takibi" : `${teams?.find(t => t.id === profile?.team_id)?.name ?? "Takım"} - Görev Takibi`}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isAdmin ? "Admin olarak tüm takımların görevlerini görüyorsunuz" : "Takımınızın görevlerini yönetin"}
              </p>
            </div>

            <div className="flex-1 overflow-auto px-4 md:px-6 pb-6 space-y-6">
              <DashboardStats isAdmin={isAdmin} activeFilter={dashboardFilter} onFilterChange={setDashboardFilter} />

              {activeFilterLabel && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Filtre:</span>
                  <span className="font-medium text-primary">{activeFilterLabel}</span>
                  <span className="text-muted-foreground">({filteredTasks.length} görev)</span>
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setDashboardFilter({ type: "all", value: "all" })}>
                    Temizle
                  </Button>
                </div>
              )}

              {isLoading ? (
                <div className="flex items-center justify-center h-40 text-muted-foreground">Yükleniyor...</div>
              ) : filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                  <p>Henüz görev bulunmuyor.</p>
                  <Button size="sm" onClick={() => setNewTaskOpen(true)} className="gap-1.5">
                    <Plus size={14} /> İlk Görevi Ekle
                  </Button>
                </div>
              ) : (
                <TaskTable tasks={filteredTasks} teams={teams ?? []} isAdmin={isAdmin} onSelectTask={setSelectedTask} />
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col min-w-0">
        {renderSection()}
      </div>

      <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Yeni Görev Oluştur</DialogTitle>
          </DialogHeader>
          <NewTaskForm
            teamId={profile?.team_id ?? ""}
            userId={profile?.user_id ?? ""}
            onSubmit={async (task) => {
              await addTask.mutateAsync(task);
              setNewTaskOpen(false);
              toast({ title: "Başarılı", description: "Görev oluşturuldu." });
            }}
          />
        </DialogContent>
      </Dialog>

      <ReminderDialog open={reminderOpen} onOpenChange={setReminderOpen} />

      {selectedTask && (
        <TaskDetailDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
