import { Search, Bell, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProject } from "@/context/ProjectContext";

interface HeaderProps {
  onNewTask: () => void;
}

export function Header({ onNewTask }: HeaderProps) {
  const { searchQuery, setSearchQuery } = useProject();

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="relative w-full max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Görev ara..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9 h-9 bg-secondary/50 border-transparent focus:border-primary/30 text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </Button>
        <Button size="sm" onClick={onNewTask} className="gap-1.5 hidden sm:flex">
          <Plus size={14} />
          Yeni Görev
        </Button>
      </div>
    </header>
  );
}
