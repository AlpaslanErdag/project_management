import { teamMembers } from "@/data/mockData";
import { useProject } from "@/context/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Mail, MoreHorizontal, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export function TeamSection() {
  const { allTasks } = useProject();

  const getMemberStats = (memberId: string) => {
    const tasks = allTasks.filter(t => t.assignee?.id === memberId);
    return {
      total: tasks.length,
      done: tasks.filter(t => t.status === "done").length,
      inProgress: tasks.filter(t => t.status === "in_progress").length,
      overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date("2026-03-09") && t.status !== "done").length,
    };
  };

  const roleColors: Record<string, string> = {
    "Product Manager": "bg-purple-500/15 text-purple-600 border-purple-500/20",
    "Developer": "bg-primary/15 text-primary border-primary/20",
    "Designer": "bg-rose-500/15 text-rose-600 border-rose-500/20",
    "QA Engineer": "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
    "DevOps Engineer": "bg-amber-500/15 text-amber-600 border-amber-500/20",
    "Frontend Developer": "bg-cyan-500/15 text-cyan-600 border-cyan-500/20",
    "Backend Developer": "bg-orange-500/15 text-orange-600 border-orange-500/20",
  };

  return (
    <div className="flex-1 overflow-auto px-4 md:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Ekip</h1>
          <p className="text-sm text-muted-foreground">{teamMembers.length} ekip üyesi</p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus size={14} /> Üye Davet Et
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {teamMembers.map(member => {
          const stats = getMemberStats(member.id);
          return (
            <Card key={member.id} className="hover:shadow-md transition-shadow group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center text-sm font-semibold text-primary">
                      {member.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">{member.name}</CardTitle>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Badge variant="outline" className={`text-[10px] ${roleColors[member.role] || ""}`}>
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={14} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail size={12} />
                  <span>{member.email}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/50">
                    <CheckCircle2 size={14} className="text-emerald-500 mb-1" />
                    <span className="text-sm font-semibold">{stats.done}</span>
                    <span className="text-[10px] text-muted-foreground">Bitti</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/50">
                    <Clock size={14} className="text-primary mb-1" />
                    <span className="text-sm font-semibold">{stats.inProgress}</span>
                    <span className="text-[10px] text-muted-foreground">Devam</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/50">
                    <AlertCircle size={14} className="text-rose-500 mb-1" />
                    <span className="text-sm font-semibold">{stats.overdue}</span>
                    <span className="text-[10px] text-muted-foreground">Geciken</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground pt-1">
                  Toplam {stats.total} görev atandı
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
