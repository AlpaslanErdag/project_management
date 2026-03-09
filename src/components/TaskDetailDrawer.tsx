import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTasks, type TaskRow } from "@/hooks/useTasks";
import { Trash2 } from "lucide-react";
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

interface Props {
  task: TaskRow;
  onClose: () => void;
}

export function TaskDetailDrawer({ task, onClose }: Props) {
  const { updateTask, deleteTask } = useTasks();
  const [weeklyProgress, setWeeklyProgress] = useState(task.weekly_progress ?? "");

  const handleUpdate = (updates: Partial<TaskRow>) => {
    updateTask.mutate({ id: task.id, ...updates }, {
      onSuccess: () => toast({ title: "Güncellendi" }),
    });
  };

  const handleDelete = () => {
    deleteTask.mutate(task.id, {
      onSuccess: () => {
        toast({ title: "Görev silindi" });
        onClose();
      },
    });
  };

  return (
    <Sheet open onOpenChange={open => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto scrollbar-thin">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={`text-xs border ${statusColors[task.status] ?? ""}`}>
              {statusLabels[task.status] ?? task.status}
            </Badge>
          </div>
          <SheetTitle className="text-lg">{task.project_or_request}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <label className="text-muted-foreground text-xs block mb-1">Görevli Personel</label>
              <Input
                defaultValue={task.assigned_personnel ?? ""}
                onBlur={e => handleUpdate({ assigned_personnel: e.target.value || null })}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-xs block mb-1">Tahmini Bitiş</label>
              <Input
                defaultValue={task.estimated_completion ?? ""}
                onBlur={e => handleUpdate({ estimated_completion: e.target.value || null })}
                className="h-8 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-muted-foreground text-xs block mb-1">Durum</label>
              <Select
                value={task.status}
                onValueChange={v => handleUpdate({ status: v })}
              >
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="devam_ediyor">Devam Ediyor</SelectItem>
                  <SelectItem value="tamamlandi">Tamamlandı</SelectItem>
                  <SelectItem value="beklemede">Beklemede</SelectItem>
                  <SelectItem value="iptal">İptal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-muted-foreground text-xs block mb-1">Proje</label>
              <Input
                defaultValue={task.project_name ?? ""}
                onBlur={e => handleUpdate({ project_name: e.target.value || null })}
                className="h-8 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-muted-foreground text-xs block mb-1">Haftalık İlerleme</label>
            <Textarea
              value={weeklyProgress}
              onChange={e => setWeeklyProgress(e.target.value)}
              onBlur={() => handleUpdate({ weekly_progress: weeklyProgress || null })}
              placeholder="Hafta içinde kaydedilen ilerleme..."
              className="min-h-[120px] text-sm resize-none"
            />
          </div>

          <div className="pt-3 border-t flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              Oluşturulma: {new Date(task.created_at).toLocaleDateString("tr-TR")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
            >
              <Trash2 size={14} className="mr-1" /> Sil
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
