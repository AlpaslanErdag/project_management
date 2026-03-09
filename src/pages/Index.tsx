import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TableView } from "@/components/TableView";
import { ListView } from "@/components/ListView";
import { FilterBar } from "@/components/FilterBar";
import { TaskDetailDrawer } from "@/components/TaskDetailDrawer";
import { NewTaskDialog } from "@/components/NewTaskDialog";
import { ProjectProvider, useProject } from "@/context/ProjectContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kanban, Table2, List } from "lucide-react";

type ViewMode = "kanban" | "table" | "list";

function DashboardContent() {
  const [view, setView] = useState<ViewMode>("kanban");
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const { project } = useProject();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onNewTask={() => setNewTaskOpen(true)} />
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-4 md:px-6 pt-4 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div>
              <h1 className="text-xl font-bold">{project.name}</h1>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </div>
            <Tabs value={view} onValueChange={v => setView(v as ViewMode)}>
              <TabsList className="h-8">
                <TabsTrigger value="kanban" className="text-xs gap-1.5 px-3">
                  <Kanban size={14} /> Kanban
                </TabsTrigger>
                <TabsTrigger value="table" className="text-xs gap-1.5 px-3">
                  <Table2 size={14} /> Tablo
                </TabsTrigger>
                <TabsTrigger value="list" className="text-xs gap-1.5 px-3">
                  <List size={14} /> Liste
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="px-4 md:px-6 pb-3 shrink-0">
            <FilterBar />
          </div>

          <div className="flex-1 overflow-auto px-4 md:px-6 pb-6">
            {view === "kanban" && <KanbanBoard />}
            {view === "table" && <TableView />}
            {view === "list" && <ListView />}
          </div>
        </div>
      </div>

      <TaskDetailDrawer />
      <NewTaskDialog open={newTaskOpen} onOpenChange={setNewTaskOpen} />
    </div>
  );
}

const Index = () => (
  <ProjectProvider>
    <DashboardContent />
  </ProjectProvider>
);

export default Index;
