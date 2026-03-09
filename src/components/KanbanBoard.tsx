import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useProject } from "@/context/ProjectContext";
import { TaskCard } from "@/components/TaskCard";
import { TaskStatus } from "@/types/project";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const columnColors: Record<string, string> = {
  backlog: "bg-muted-foreground/60",
  todo: "bg-info",
  in_progress: "bg-warning",
  done: "bg-success",
};

export function KanbanBoard() {
  const { project, filteredTasks, moveTask, setSelectedTask } = useProject();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    moveTask(result.draggableId, result.destination.droppableId as TaskStatus, result.destination.index);
  };

  const getColumnTasks = (colId: string) =>
    filteredTasks.filter(t => t.status === colId);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 h-full scrollbar-thin px-1">
        {project.columns.map(col => (
          <div key={col.id} className="flex flex-col w-72 min-w-[272px] shrink-0">
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className={`w-2 h-2 rounded-full ${columnColors[col.id] || "bg-primary"}`} />
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <span className="text-xs text-muted-foreground bg-secondary rounded-full px-2 py-0.5 ml-auto">
                {getColumnTasks(col.id).length}
              </span>
            </div>
            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 space-y-2 p-1 rounded-lg min-h-[120px] transition-colors ${
                    snapshot.isDraggingOver ? "bg-primary/5" : ""
                  }`}
                >
                  {getColumnTasks(col.id).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard
                            task={task}
                            onClick={() => setSelectedTask(task)}
                            isDragging={snapshot.isDragging}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
