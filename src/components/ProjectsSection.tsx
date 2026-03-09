import { projectsList, ProjectInfo } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, CheckSquare, FolderKanban } from "lucide-react";

const statusConfig: Record<ProjectInfo["status"], { label: string; className: string }> = {
  active: { label: "Aktif", className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" },
  completed: { label: "Tamamlandı", className: "bg-primary/15 text-primary border-primary/20" },
  "on-hold": { label: "Beklemede", className: "bg-amber-500/15 text-amber-600 border-amber-500/20" },
};

const colorMap: Record<string, string> = {
  indigo: "bg-primary",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  cyan: "bg-cyan-500",
};

export function ProjectsSection() {
  return (
    <div className="flex-1 overflow-auto px-4 md:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Projeler</h1>
          <p className="text-sm text-muted-foreground">Tüm projelerinizi yönetin</p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus size={14} /> Yeni Proje
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projectsList.map(project => {
          const status = statusConfig[project.status];
          return (
            <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${colorMap[project.color] || "bg-primary"} flex items-center justify-center`}>
                      <FolderKanban size={18} className="text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold group-hover:text-primary transition-colors">
                        {project.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{project.description}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={status.className}>
                    {status.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Bitiş: {new Date(project.dueDate).toLocaleDateString("tr-TR")}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">İlerleme</span>
                    <span className="font-medium">%{project.progress}</span>
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {project.memberCount} üye
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckSquare size={12} /> {project.taskCount} görev
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
