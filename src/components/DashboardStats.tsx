import { useTasks, type TaskRow } from "@/hooks/useTasks";
import { useTeams, type TeamRow } from "@/hooks/useTeams";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, AlertTriangle, ListTodo, TrendingUp, Users } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  accent?: string;
}

function StatsCard({ title, value, subtitle, icon: Icon, accent = "text-primary" }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-4 flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-secondary ${accent}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-xl font-bold">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function TeamKpiCard({ team, tasks }: { team: TeamRow; tasks: TaskRow[] }) {
  const teamTasks = tasks.filter(t => t.team_id === team.id);
  const total = teamTasks.length;
  const completed = teamTasks.filter(t => t.status === "tamamlandi").length;
  const inProgress = teamTasks.filter(t => t.status === "devam_ediyor").length;
  const waiting = teamTasks.filter(t => t.status === "beklemede").length;
  const overdue = teamTasks.filter(t => {
    if (t.status === "tamamlandi" || !t.estimated_completion) return false;
    return new Date(t.estimated_completion) < new Date();
  }).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color ?? "hsl(var(--primary))" }} />
          <CardTitle className="text-sm font-semibold">{team.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">İlerleme</span>
            <span className="font-medium">%{progress}</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span>{completed} tamamlandı</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-blue-500" />
            <span>{inProgress} devam</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ListTodo size={12} className="text-amber-500" />
            <span>{waiting} beklemede</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={12} className="text-destructive" />
            <span>{overdue} gecikmiş</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats({ isAdmin }: { isAdmin: boolean }) {
  const { tasks } = useTasks();
  const { data: teams } = useTeams();

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "tamamlandi").length;
  const inProgress = tasks.filter(t => t.status === "devam_ediyor").length;
  const overdue = tasks.filter(t => {
    if (t.status === "tamamlandi" || !t.estimated_completion) return false;
    return new Date(t.estimated_completion) < new Date();
  }).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Global summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatsCard title="Toplam Görev" value={total} icon={ListTodo} />
        <StatsCard title="Tamamlanan" value={completed} subtitle={`%${completionRate} oran`} icon={CheckCircle2} accent="text-emerald-500" />
        <StatsCard title="Devam Eden" value={inProgress} icon={Clock} accent="text-blue-500" />
        <StatsCard title="Gecikmiş" value={overdue} icon={AlertTriangle} accent="text-destructive" />
      </div>

      {/* Per-team KPI (admin only) */}
      {isAdmin && teams && teams.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Users size={14} /> Takım Bazlı KPI
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {teams.map(team => (
              <TeamKpiCard key={team.id} team={team} tasks={tasks} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
