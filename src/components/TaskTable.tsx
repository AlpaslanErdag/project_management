import type { TaskRow } from "@/hooks/useTasks";
import type { TeamRow } from "@/hooks/useTeams";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const statusLabels: Record<string, string> = {
  devam_ediyor: "Devam Ediyor",
  tamamlandi: "Tamamlandı",
  beklemede: "Beklemede",
  iptal: "İptal",
};

const statusColors: Record<string, string> = {
  devam_ediyor: "bg-warning/10 text-warning border-warning/30",
  tamamlandi: "bg-success/10 text-success border-success/30",
  beklemede: "bg-info/10 text-info border-info/30",
  iptal: "bg-destructive/10 text-destructive border-destructive/30",
};

interface Props {
  tasks: TaskRow[];
  teams: TeamRow[];
  isAdmin: boolean;
  onSelectTask: (task: TaskRow) => void;
}

export function TaskTable({ tasks, teams, isAdmin, onSelectTask }: Props) {
  const teamMap = Object.fromEntries(teams.map(t => [t.id, t.name]));

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {isAdmin && <TableHead className="font-semibold">Takım</TableHead>}
            <TableHead className="font-semibold">Proje / Talep</TableHead>
            <TableHead className="font-semibold">Görevli Personel</TableHead>
            <TableHead className="font-semibold">Tahmini Bitiş</TableHead>
            <TableHead className="font-semibold">Durum</TableHead>
            <TableHead className="font-semibold">Proje</TableHead>
            <TableHead className="font-semibold">Haftalık İlerleme</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map(task => (
            <TableRow
              key={task.id}
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => onSelectTask(task)}
            >
              {isAdmin && <TableCell className="text-sm">{teamMap[task.team_id] ?? "-"}</TableCell>}
              <TableCell className="font-medium text-sm max-w-[250px] truncate">{task.project_or_request}</TableCell>
              <TableCell className="text-sm">{task.assigned_personnel ?? "-"}</TableCell>
              <TableCell className="text-sm">{task.estimated_completion ?? "-"}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`text-xs ${statusColors[task.status] ?? ""}`}>
                  {statusLabels[task.status] ?? task.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{task.project_name ?? "-"}</TableCell>
              <TableCell className="text-sm max-w-[200px] truncate">{task.weekly_progress ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
