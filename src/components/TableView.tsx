import { useProject } from "@/context/ProjectContext";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const priorityConfig = {
  high: { label: "High", className: "bg-priority-high/10 text-priority-high border-priority-high/20" },
  medium: { label: "Medium", className: "bg-priority-medium/10 text-priority-medium border-priority-medium/20" },
  low: { label: "Low", className: "bg-priority-low/10 text-priority-low border-priority-low/20" },
};

const statusLabels: Record<string, string> = {
  backlog: "Backlog",
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

export function TableView() {
  const { filteredTasks, setSelectedTask } = useProject();

  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[300px]">Görev</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Öncelik</TableHead>
            <TableHead>Atanan</TableHead>
            <TableHead>Bitiş Tarihi</TableHead>
            <TableHead>Etiketler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                Görev bulunamadı
              </TableCell>
            </TableRow>
          ) : (
            filteredTasks.map(task => {
              const prio = priorityConfig[task.priority];
              return (
                <TableRow
                  key={task.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <TableCell className="font-medium text-sm">{task.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs font-normal">
                      {statusLabels[task.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs font-medium border", prio.className)}>
                      {prio.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{task.assignee.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {task.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
