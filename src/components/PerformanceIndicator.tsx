import { useTasks } from "@/hooks/useTasks";
import { useTeams } from "@/hooks/useTeams";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, Clock, TrendingUp } from "lucide-react";

export function PerformanceIndicator() {
  const { tasks, isLoading } = useTasks();
  const { data: teams } = useTeams();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        Yükleniyor...
      </div>
    );
  }

  const now = new Date();

  type TaskWithStatus = typeof tasks[number] & {
    performanceStatus: "on_time" | "overdue" | "pending";
  };

  const tasksWithPerformance: TaskWithStatus[] = tasks.map((task) => {
    let performanceStatus: "on_time" | "overdue" | "pending" = "pending";

    if (task.estimated_completion) {
      const estimatedDate = new Date(task.estimated_completion);

      if (task.status === "tamamlandi") {
        // Completed: check if completed before or after estimated date
        const updatedAt = new Date(task.updated_at);
        performanceStatus = updatedAt <= estimatedDate ? "on_time" : "overdue";
      } else if (task.status !== "iptal") {
        // Still in progress: check if past due
        performanceStatus = now > estimatedDate ? "overdue" : "pending";
      }
    }

    return { ...task, performanceStatus };
  });

  const overdueCount = tasksWithPerformance.filter(
    (t) => t.performanceStatus === "overdue"
  ).length;
  const onTimeCount = tasksWithPerformance.filter(
    (t) => t.performanceStatus === "on_time"
  ).length;
  const pendingCount = tasksWithPerformance.filter(
    (t) => t.performanceStatus === "pending"
  ).length;

  const getTeamName = (teamId: string) =>
    teams?.find((t) => t.id === teamId)?.name ?? "—";

  const statusLabel: Record<string, string> = {
    devam_ediyor: "Devam Ediyor",
    tamamlandi: "Tamamlandı",
    beklemede: "Beklemede",
    iptal: "İptal",
  };

  return (
    <div className="flex-1 overflow-auto px-4 md:px-6 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Performans Göstergesi</h1>
        <p className="text-sm text-muted-foreground">
          Tüm takımların görev tamamlama performansı
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{onTimeCount}</p>
              <p className="text-xs text-muted-foreground">Zamanında Tamamlanan</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-full bg-destructive/15 flex items-center justify-center">
              <AlertTriangle size={20} className="text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">{overdueCount}</p>
              <p className="text-xs text-muted-foreground">Süresi Aşan</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center">
              <Clock size={20} className="text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Devam Eden</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task list with color coding */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp size={16} /> Görev Detayları
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasksWithPerformance.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Henüz görev bulunmuyor.
            </p>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_120px_120px_100px_120px] gap-2 text-xs font-medium text-muted-foreground pb-2 border-b">
                <span>Proje / Talep</span>
                <span>Personel</span>
                <span>Takım</span>
                <span>Durum</span>
                <span>Tahmini Bitiş</span>
              </div>
              {tasksWithPerformance.map((task) => {
                const rowColor =
                  task.performanceStatus === "on_time"
                    ? "bg-emerald-500/10 border-l-4 border-l-emerald-500"
                    : task.performanceStatus === "overdue"
                    ? "bg-destructive/10 border-l-4 border-l-destructive"
                    : "bg-muted/30 border-l-4 border-l-transparent";

                return (
                  <div
                    key={task.id}
                    className={`grid grid-cols-[1fr_120px_120px_100px_120px] gap-2 items-center text-sm py-2 px-2 rounded-md ${rowColor}`}
                  >
                    <span className="truncate font-medium">
                      {task.project_or_request}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {task.assigned_personnel ?? "—"}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {getTeamName(task.team_id)}
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
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
