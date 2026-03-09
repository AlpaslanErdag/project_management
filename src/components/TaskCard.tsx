import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, GripVertical } from "lucide-react";
import { Task } from "@/types/project";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  isDragging?: boolean;
}

const priorityConfig = {
  high: { label: "High", className: "bg-priority-high/10 text-priority-high border-priority-high/20" },
  medium: { label: "Medium", className: "bg-priority-medium/10 text-priority-medium border-priority-medium/20" },
  low: { label: "Low", className: "bg-priority-low/10 text-priority-low border-priority-low/20" },
};

export function TaskCard({ task, onClick, isDragging }: TaskCardProps) {
  const prio = priorityConfig[task.priority];
  const completedSubtasks = task.subtasks.filter(s => s.completed).length;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group bg-card rounded-lg border p-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/20",
        isDragging && "shadow-lg rotate-2 border-primary/30"
      )}
    >
      <div className="flex items-start gap-2">
        <GripVertical size={14} className="mt-0.5 text-muted-foreground/30 group-hover:text-muted-foreground/60 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-4 font-medium border", prio.className)}>
              {prio.label}
            </Badge>
            {task.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal">
                {tag}
              </Badge>
            ))}
          </div>
          <h4 className="text-sm font-medium leading-snug mb-2 line-clamp-2">{task.title}</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              {task.dueDate && (
                <div className="flex items-center gap-1 text-[11px]">
                  <Calendar size={11} />
                  <span>{new Date(task.dueDate).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}</span>
                </div>
              )}
              {task.subtasks.length > 0 && (
                <span className="text-[11px]">{completedSubtasks}/{task.subtasks.length}</span>
              )}
            </div>
            {task.assignee && (
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-medium">
                  {task.assignee.avatar}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
