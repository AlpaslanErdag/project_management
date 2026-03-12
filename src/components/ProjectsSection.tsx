import { useTeams } from "@/hooks/useTeams";
import { useTasks } from "@/hooks/useTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, CheckSquare, FolderKanban } from "lucide-react";

export function ProjectsSection() {
  const { data: teams } = useTeams();
  const { tasks } = useTasks();

  const teamStats = (teams ?? []).map(team => {
    const teamTasks = tasks.filter(t => t.team_id === team.id);
    const completed = teamTasks.filter(t => t.status === "tamamlandi").length;
    const total = teamTasks.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { ...team, total, completed, progress };
  });

  return (
    <div className="flex-1 overflow-auto px-4 md:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Projeler / Takımlar</h1>
        <p className="text-sm text-muted-foreground">Takım bazlı görev durumlarını görün</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {teamStats.map(team => (
          <Card key={team.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: team.color ?? "hsl(var(--primary))" }}>
                  <FolderKanban size={18} className="text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">{team.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{team.description ?? ""}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Tamamlanma</span>
                  <span className="font-medium">%{team.progress}</span>
                </div>
                <Progress value={team.progress} className="h-1.5" />
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><CheckSquare size={12} /> {team.completed}/{team.total} görev</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
