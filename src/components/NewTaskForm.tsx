import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TablesInsert } from "@/integrations/supabase/types";

interface Props {
  teamId: string;
  userId: string;
  onSubmit: (task: TablesInsert<"tasks">) => Promise<void>;
}

export function NewTaskForm({ teamId, userId, onSubmit }: Props) {
  const [projectOrRequest, setProjectOrRequest] = useState("");
  const [assignedPersonnel, setAssignedPersonnel] = useState("");
  const [estimatedCompletion, setEstimatedCompletion] = useState("");
  const [status, setStatus] = useState("devam_ediyor");
  const [projectName, setProjectName] = useState("");
  const [weeklyProgress, setWeeklyProgress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectOrRequest.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        team_id: teamId,
        created_by: userId,
        project_or_request: projectOrRequest.trim(),
        assigned_personnel: assignedPersonnel || null,
        estimated_completion: estimatedCompletion || null,
        status,
        project_name: projectName || null,
        weekly_progress: weeklyProgress || null,
      });
      setProjectOrRequest("");
      setAssignedPersonnel("");
      setEstimatedCompletion("");
      setStatus("devam_ediyor");
      setProjectName("");
      setWeeklyProgress("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-2">
      <Input
        placeholder="Proje ya da talep (e-yazı numarasıyla)"
        value={projectOrRequest}
        onChange={e => setProjectOrRequest(e.target.value)}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          placeholder="Görevli Personel"
          value={assignedPersonnel}
          onChange={e => setAssignedPersonnel(e.target.value)}
        />
        <Input
          placeholder="Tahmini Bitiş Süresi"
          value={estimatedCompletion}
          onChange={e => setEstimatedCompletion(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="devam_ediyor">Devam Ediyor</SelectItem>
            <SelectItem value="tamamlandi">Tamamlandı</SelectItem>
            <SelectItem value="beklemede">Beklemede</SelectItem>
            <SelectItem value="iptal">İptal</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Proje adı"
          value={projectName}
          onChange={e => setProjectName(e.target.value)}
        />
      </div>
      <Textarea
        placeholder="Hafta içinde kaydedilen ilerleme..."
        value={weeklyProgress}
        onChange={e => setWeeklyProgress(e.target.value)}
        className="resize-none"
        rows={3}
      />
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Oluşturuluyor..." : "Görev Oluştur"}
      </Button>
    </form>
  );
}
