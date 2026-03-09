import { useProject } from "@/context/ProjectContext";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const priorityConfig = {
  high: { label: "High", className: "bg-priority-high/10 text-priority-high border-priority-high/20" },
  medium: { label: "Medium", className: "bg-priority-medium/10 text-priority-medium border-priority-medium/20" },
  low: { label: "Low", className: "bg-priority-low/10 text-priority-low border-priority-low/20" },
};

export function ListView() {
  const { filteredTasks, setSelectedTask } = useProject();

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <CheckSquare size={48} className="mb-4 opacity-30" />
        <p className="text-lg font-medium">Görev bulunamadı</p>
        <p className="text-sm">Filtrelerinizi değiştirmeyi deneyin</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredTasks.map(task => {
        const prio = priorityConfig[task.priority];
        const completedSubs = task.subtasks.filter(s => s.completed).length;
        return (
          <div
            key={task.id}
            onClick={() => setSelectedTask(task)}
            className="flex items-center gap-4 bg-card border rounded-lg p-3 cursor-pointer hover:shadow-sm hover:border-primary/20 transition-all"
          >
            <Checkbox className="shrink-0" checked={task.status === "done"} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={cn("text-sm font-medium", task.status === "done" && "line-through text-muted-foreground")}>
                  {task.title}
                </span>
                <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-4 border", prio.className)}>
                  {prio.label}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {task.dueDate && (
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {new Date(task.dueDate).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                  </span>
                )}
                {task.subtasks.length > 0 && (
                  <span>{completedSubs}/{task.subtasks.length} alt görev</span>
                )}
                {task.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-[10px] h-4 px-1.5 py-0">{tag}</Badge>
                ))}
              </div>
            </div>
            {task.assignee && (
              <Avatar className="w-7 h-7 shrink-0">
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-medium">
                  {task.assignee.avatar}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        );
      })}
    </div>
  );
}
