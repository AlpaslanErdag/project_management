import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProject } from "@/context/ProjectContext";
import { teamMembers } from "@/data/mockData";
import { Priority, TaskStatus } from "@/types/project";
import { Plus } from "lucide-react";

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewTaskDialog({ open, onOpenChange }: NewTaskDialogProps) {
  const { addTask } = useProject();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<Priority>("medium");
  const [assigneeId, setAssigneeId] = useState("none");
  const [dueDate, setDueDate] = useState("");
  const [tagInput, setTagInput] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    const assignee = teamMembers.find(m => m.id === assigneeId);
    const tags = tagInput.split(",").map(t => t.trim()).filter(Boolean);
    addTask({
      title: title.trim(),
      description,
      status,
      priority,
      assignee,
      dueDate: dueDate || undefined,
      tags,
      subtasks: [],
    });
    setTitle(""); setDescription(""); setStatus("todo"); setPriority("medium");
    setAssigneeId("none"); setDueDate(""); setTagInput("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni Görev Oluştur</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <Input placeholder="Görev başlığı" value={title} onChange={e => setTitle(e.target.value)} />
          <Textarea placeholder="Açıklama..." value={description} onChange={e => setDescription(e.target.value)} className="resize-none" rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <Select value={status} onValueChange={v => setStatus(v as TaskStatus)}>
              <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priority} onValueChange={v => setPriority(v as Priority)}>
              <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger className="text-sm"><SelectValue placeholder="Atanan kişi" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Yok</SelectItem>
                {teamMembers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="text-sm" />
          </div>
          <Input placeholder="Etiketler (virgülle ayır)" value={tagInput} onChange={e => setTagInput(e.target.value)} className="text-sm" />
          <Button onClick={handleSubmit} className="w-full">Görev Oluştur</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
