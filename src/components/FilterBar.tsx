import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProject } from "@/context/ProjectContext";
import { teamMembers } from "@/data/mockData";

export function FilterBar() {
  const { filterAssignee, setFilterAssignee, filterPriority, setFilterPriority, filterTag, setFilterTag, allTasks } = useProject();

  const allTags = [...new Set(allTasks.flatMap(t => t.tags))];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Select value={filterAssignee} onValueChange={setFilterAssignee}>
        <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue placeholder="Atanan" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Kişiler</SelectItem>
          {teamMembers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filterPriority} onValueChange={setFilterPriority}>
        <SelectTrigger className="h-8 w-[120px] text-xs"><SelectValue placeholder="Öncelik" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Öncelikler</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterTag} onValueChange={setFilterTag}>
        <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue placeholder="Etiket" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Etiketler</SelectItem>
          {allTags.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
