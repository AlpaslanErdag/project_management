import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProject } from "@/context/ProjectContext";
import { Calendar, MessageSquare, Clock, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskStatus, Priority } from "@/types/project";
import { teamMembers } from "@/data/mockData";

const priorityConfig = {
  high: { label: "High", className: "bg-priority-high/10 text-priority-high border-priority-high/20" },
  medium: { label: "Medium", className: "bg-priority-medium/10 text-priority-medium border-priority-medium/20" },
  low: { label: "Low", className: "bg-priority-low/10 text-priority-low border-priority-low/20" },
};

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export function TaskDetailDrawer() {
  const { selectedTask, setSelectedTask, toggleSubtask, addComment, addSubtask, updateTask, deleteTask, moveTask } = useProject();
  const [commentText, setCommentText] = useState("");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  if (!selectedTask) return null;

  const prio = priorityConfig[selectedTask.priority];
  const completedSubs = selectedTask.subtasks.filter(s => s.completed).length;

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addComment(selectedTask.id, commentText.trim());
    setCommentText("");
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    addSubtask(selectedTask.id, newSubtaskTitle.trim());
    setNewSubtaskTitle("");
  };

  return (
    <Sheet open={!!selectedTask} onOpenChange={open => !open && setSelectedTask(null)}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto scrollbar-thin">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={cn("text-xs border", prio.className)}>{prio.label}</Badge>
            <Select
              value={selectedTask.status}
              onValueChange={v => moveTask(selectedTask.id, v as TaskStatus)}
            >
              <SelectTrigger className="h-6 w-auto text-xs border-none bg-secondary px-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <SheetTitle className="text-lg">{selectedTask.title}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-2">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <label className="text-muted-foreground text-xs block mb-1">Atanan</label>
              {selectedTask.assignee ? (
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{selectedTask.assignee.avatar}</AvatarFallback>
                  </Avatar>
                  <span>{selectedTask.assignee.name}</span>
                </div>
              ) : <span className="text-muted-foreground">Atanmamış</span>}
            </div>
            <div>
              <label className="text-muted-foreground text-xs block mb-1">Bitiş Tarihi</label>
              <div className="flex items-center gap-1">
                <Calendar size={13} className="text-muted-foreground" />
                <span>{selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString("tr-TR") : "—"}</span>
              </div>
            </div>
          </div>

          {/* Priority & Assignee change */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-muted-foreground text-xs block mb-1">Öncelik</label>
              <Select
                value={selectedTask.priority}
                onValueChange={v => updateTask(selectedTask.id, { priority: v as Priority })}
              >
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-muted-foreground text-xs block mb-1">Kişi Ata</label>
              <Select
                value={selectedTask.assignee?.id || "none"}
                onValueChange={v => {
                  const member = teamMembers.find(m => m.id === v);
                  updateTask(selectedTask.id, { assignee: member });
                }}
              >
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Yok</SelectItem>
                  {teamMembers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1 text-xs">Açıklama</TabsTrigger>
              <TabsTrigger value="subtasks" className="flex-1 text-xs">Alt Görevler ({completedSubs}/{selectedTask.subtasks.length})</TabsTrigger>
              <TabsTrigger value="activity" className="flex-1 text-xs">Aktivite</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-3">
              <Textarea
                value={selectedTask.description}
                onChange={e => updateTask(selectedTask.id, { description: e.target.value })}
                placeholder="Açıklama ekle..."
                className="min-h-[120px] text-sm resize-none"
              />
            </TabsContent>

            <TabsContent value="subtasks" className="mt-3 space-y-2">
              {selectedTask.subtasks.map(st => (
                <div key={st.id} className="flex items-center gap-2 py-1">
                  <Checkbox
                    checked={st.completed}
                    onCheckedChange={() => toggleSubtask(selectedTask.id, st.id)}
                  />
                  <span className={cn("text-sm", st.completed && "line-through text-muted-foreground")}>{st.title}</span>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <Input
                  value={newSubtaskTitle}
                  onChange={e => setNewSubtaskTitle(e.target.value)}
                  placeholder="Alt görev ekle..."
                  className="h-8 text-sm"
                  onKeyDown={e => e.key === "Enter" && handleAddSubtask()}
                />
                <Button size="sm" variant="secondary" onClick={handleAddSubtask} className="h-8 px-3">
                  <Plus size={14} />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-3 space-y-3">
              {selectedTask.activities.length === 0 && selectedTask.comments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Henüz aktivite yok</p>
              ) : (
                <>
                  {selectedTask.activities.map(act => (
                    <div key={act.id} className="flex items-start gap-2 text-sm">
                      <Clock size={14} className="mt-0.5 text-muted-foreground shrink-0" />
                      <div>
                        <span className="font-medium">{act.user}</span>{" "}
                        <span className="text-muted-foreground">{act.action}</span>
                        <p className="text-xs text-muted-foreground">{new Date(act.timestamp).toLocaleString("tr-TR")}</p>
                      </div>
                    </div>
                  ))}
                  {selectedTask.comments.map(c => (
                    <div key={c.id} className="flex items-start gap-2 text-sm border-l-2 border-primary/20 pl-3">
                      <Avatar className="w-6 h-6 shrink-0">
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{c.author.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium">{c.author.name}</span>
                        <p className="text-muted-foreground">{c.text}</p>
                        <p className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleString("tr-TR")}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}

              <div className="flex gap-2 mt-4 pt-3 border-t">
                <Input
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Yorum yaz..."
                  className="h-8 text-sm"
                  onKeyDown={e => e.key === "Enter" && handleAddComment()}
                />
                <Button size="sm" variant="secondary" onClick={handleAddComment} className="h-8 px-3">
                  <MessageSquare size={14} />
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="pt-3 border-t flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => { deleteTask(selectedTask.id); setSelectedTask(null); }}
            >
              <Trash2 size={14} className="mr-1" /> Sil
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
