import { useState, useRef, useEffect } from "react";
import type { TaskRow } from "@/hooks/useTasks";
import { useTasks } from "@/hooks/useTasks";
import type { TeamRow } from "@/hooks/useTeams";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

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

type EditingCell = { taskId: string; field: string } | null;

function InlineInput({ value, onSave, type = "text" }: { value: string; onSave: (v: string) => void; type?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [val, setVal] = useState(value);

  useEffect(() => { ref.current?.focus(); ref.current?.select(); }, []);

  const commit = () => { if (val !== value) onSave(val); };

  return (
    <input
      ref={ref}
      type={type}
      value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === "Enter") { commit(); (e.target as HTMLInputElement).blur(); } if (e.key === "Escape") { setVal(value); (e.target as HTMLInputElement).blur(); } }}
      className="w-full bg-transparent border-b border-primary/40 outline-none text-sm py-0.5 px-0"
    />
  );
}

interface Props {
  tasks: TaskRow[];
  teams: TeamRow[];
  isAdmin: boolean;
  onSelectTask: (task: TaskRow) => void;
}

export function TaskTable({ tasks, teams, isAdmin, onSelectTask }: Props) {
  const { updateTask } = useTasks();
  const [editing, setEditing] = useState<EditingCell>(null);
  const teamMap = Object.fromEntries(teams.map(t => [t.id, t.name]));

  const handleSave = (taskId: string, field: string, value: string) => {
    setEditing(null);
    updateTask.mutate(
      { id: taskId, [field]: value || null } as any,
      { onSuccess: () => toast({ title: "Güncellendi" }) }
    );
  };

  const isEditing = (taskId: string, field: string) =>
    editing?.taskId === taskId && editing?.field === field;

  const startEdit = (e: React.MouseEvent, taskId: string, field: string) => {
    e.stopPropagation();
    setEditing({ taskId, field });
  };

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

              {/* Proje / Talep */}
              <TableCell className="font-medium text-sm max-w-[250px]" onClick={e => startEdit(e, task.id, "project_or_request")}>
                {isEditing(task.id, "project_or_request") ? (
                  <InlineInput value={task.project_or_request} onSave={v => handleSave(task.id, "project_or_request", v)} />
                ) : (
                  <span className="truncate block hover:text-primary transition-colors">{task.project_or_request}</span>
                )}
              </TableCell>

              {/* Görevli Personel */}
              <TableCell className="text-sm" onClick={e => startEdit(e, task.id, "assigned_personnel")}>
                {isEditing(task.id, "assigned_personnel") ? (
                  <InlineInput value={task.assigned_personnel ?? ""} onSave={v => handleSave(task.id, "assigned_personnel", v)} />
                ) : (
                  <span className="hover:text-primary transition-colors">{task.assigned_personnel ?? "-"}</span>
                )}
              </TableCell>

              {/* Tahmini Bitiş */}
              <TableCell className="text-sm" onClick={e => startEdit(e, task.id, "estimated_completion")}>
                {isEditing(task.id, "estimated_completion") ? (
                  <InlineInput value={task.estimated_completion ?? ""} onSave={v => handleSave(task.id, "estimated_completion", v)} />
                ) : (
                  <span className="hover:text-primary transition-colors">{task.estimated_completion ?? "-"}</span>
                )}
              </TableCell>

              {/* Durum - select */}
              <TableCell onClick={e => e.stopPropagation()}>
                <Select
                  value={task.status}
                  onValueChange={v => handleSave(task.id, "status", v)}
                >
                  <SelectTrigger className="h-7 w-auto border-none p-0 shadow-none focus:ring-0">
                    <Badge variant="outline" className={`text-xs ${statusColors[task.status] ?? ""}`}>
                      {statusLabels[task.status] ?? task.status}
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="devam_ediyor">Devam Ediyor</SelectItem>
                    <SelectItem value="tamamlandi">Tamamlandı</SelectItem>
                    <SelectItem value="beklemede">Beklemede</SelectItem>
                    <SelectItem value="iptal">İptal</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>

              {/* Proje */}
              <TableCell className="text-sm" onClick={e => startEdit(e, task.id, "project_name")}>
                {isEditing(task.id, "project_name") ? (
                  <InlineInput value={task.project_name ?? ""} onSave={v => handleSave(task.id, "project_name", v)} />
                ) : (
                  <span className="hover:text-primary transition-colors">{task.project_name ?? "-"}</span>
                )}
              </TableCell>

              {/* Haftalık İlerleme */}
              <TableCell className="text-sm max-w-[200px]" onClick={e => startEdit(e, task.id, "weekly_progress")}>
                {isEditing(task.id, "weekly_progress") ? (
                  <InlineInput value={task.weekly_progress ?? ""} onSave={v => handleSave(task.id, "weekly_progress", v)} />
                ) : (
                  <span className="truncate block hover:text-primary transition-colors">{task.weekly_progress ?? "-"}</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
