import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import { useTeams } from "@/hooks/useTeams";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { exportTasksToExcel } from "@/lib/excel";
import { FileText, Download, Calendar, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

function getWeekRange(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  friday.setHours(18, 0, 0, 0);
  return { monday, friday };
}

function formatDate(d: Date) {
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export function WeeklyReportsSection() {
  const { isAdmin } = useAuth();
  const { tasks } = useTasks();
  const { data: teams } = useTeams();

  const now = new Date();
  const { monday: currentWeekStart, friday: currentWeekEnd } = getWeekRange(now);

  // Generate last 4 weeks
  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < 4; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() - i * 7);
      const { monday, friday } = getWeekRange(d);
      result.push({ monday, friday, label: `${formatDate(monday)} - ${formatDate(friday)}` });
    }
    return result;
  }, []);

  const [selectedWeekIdx, setSelectedWeekIdx] = useState(0);
  const selectedWeek = weeks[selectedWeekIdx];

  // Filter tasks updated within the selected week
  const weekTasks = useMemo(() => {
    const start = selectedWeek.monday;
    const end = new Date(selectedWeek.friday);
    end.setHours(23, 59, 59, 999);
    return tasks.filter((t) => {
      const updated = new Date(t.updated_at);
      return updated >= start && updated <= end;
    });
  }, [tasks, selectedWeek]);

  // Group by team
  const teamGroups = useMemo(() => {
    const groups: Record<string, typeof weekTasks> = {};
    weekTasks.forEach((t) => {
      if (!groups[t.team_id]) groups[t.team_id] = [];
      groups[t.team_id].push(t);
    });
    return groups;
  }, [weekTasks]);

  const getTeamName = (id: string) => teams?.find((t) => t.id === id)?.name ?? "—";

  const handleMergeExport = () => {
    if (weekTasks.length === 0) {
      toast({ title: "Uyarı", description: "Bu hafta için rapor verisi yok.", variant: "destructive" });
      return;
    }
    exportTasksToExcel(weekTasks, `Haftalık_Rapor_${formatDate(selectedWeek.monday)}`);
    toast({ title: "Başarılı", description: "Birleşik haftalık rapor indirildi." });
  };

  const statusLabel: Record<string, string> = {
    devam_ediyor: "Devam Ediyor",
    tamamlandi: "Tamamlandı",
    beklemede: "Beklemede",
    iptal: "İptal",
  };

  const isFridayPast = () => {
    return now >= selectedWeek.friday;
  };

  if (!isAdmin) return null;

  return (
    <div className="flex-1 overflow-auto px-4 md:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <FileText size={20} /> Haftalık Raporlar
          </h1>
          <p className="text-sm text-muted-foreground">
            Takımların haftalık çalışma raporları (Cuma 18:00 itibarıyla)
          </p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={handleMergeExport}>
          <Download size={14} /> Birleşik Rapor İndir
        </Button>
      </div>

      {/* Week selector */}
      <div className="flex gap-2 flex-wrap">
        {weeks.map((w, i) => (
          <Button
            key={i}
            variant={selectedWeekIdx === i ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedWeekIdx(i)}
            className="gap-1.5"
          >
            <Calendar size={14} />
            {w.label}
            {i === 0 && !isFridayPast() && (
              <Badge variant="secondary" className="ml-1 text-[10px]">Aktif</Badge>
            )}
          </Button>
        ))}
      </div>

      {!isFridayPast() && selectedWeekIdx === 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock size={18} className="text-amber-500" />
            <p className="text-sm text-amber-700">
              Bu haftanın raporu henüz kesinleşmedi. Cuma 18:00'dan sonra nihai rapor oluşacaktır.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{weekTasks.length}</p>
            <p className="text-xs text-muted-foreground">Toplam Görev</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {weekTasks.filter((t) => t.status === "tamamlandi").length}
            </p>
            <p className="text-xs text-muted-foreground">Tamamlanan</p>
          </CardContent>
        </Card>
        <Card className="border-primary/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {weekTasks.filter((t) => t.status === "devam_ediyor").length}
            </p>
            <p className="text-xs text-muted-foreground">Devam Eden</p>
          </CardContent>
        </Card>
        <Card className="border-destructive/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-destructive">
              {weekTasks.filter((t) => {
                if (!t.estimated_completion) return false;
                const est = new Date(t.estimated_completion);
                return t.status !== "tamamlandi" && now > est;
              }).length}
            </p>
            <p className="text-xs text-muted-foreground">Süresi Aşan</p>
          </CardContent>
        </Card>
      </div>

      {/* Per-team breakdown */}
      {Object.keys(teamGroups).length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Bu hafta için henüz görev verisi bulunmuyor.
          </CardContent>
        </Card>
      ) : (
        Object.entries(teamGroups).map(([teamId, teamTasks]) => (
          <Card key={teamId}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Badge variant="outline">{getTeamName(teamId)}</Badge>
                <span className="text-muted-foreground font-normal">
                  {teamTasks.length} görev
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="grid grid-cols-[1fr_120px_100px_120px_1fr] gap-2 text-xs font-medium text-muted-foreground pb-2 border-b">
                  <span>Proje / Talep</span>
                  <span>Personel</span>
                  <span>Durum</span>
                  <span>Tahmini Bitiş</span>
                  <span>Haftalık İlerleme</span>
                </div>
                {teamTasks.map((task) => {
                  const isOverdue =
                    task.estimated_completion &&
                    task.status !== "tamamlandi" &&
                    now > new Date(task.estimated_completion);
                  const isCompleted = task.status === "tamamlandi";

                  return (
                    <div
                      key={task.id}
                      className={`grid grid-cols-[1fr_120px_100px_120px_1fr] gap-2 items-center text-sm py-2 px-2 rounded-md ${
                        isCompleted
                          ? "bg-emerald-500/10 border-l-4 border-l-emerald-500"
                          : isOverdue
                          ? "bg-destructive/10 border-l-4 border-l-destructive"
                          : "border-l-4 border-l-transparent"
                      }`}
                    >
                      <span className="truncate font-medium">{task.project_or_request}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {task.assigned_personnel ?? "—"}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          task.status === "tamamlandi"
                            ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20"
                            : task.status === "iptal"
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/15 text-primary border-primary/20"
                        }`}
                      >
                        {statusLabel[task.status] ?? task.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {task.estimated_completion ?? "—"}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {task.weekly_progress ?? "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
