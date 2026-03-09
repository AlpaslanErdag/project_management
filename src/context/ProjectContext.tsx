import React, { createContext, useContext, useState, useCallback } from "react";
import { Project, Task, TaskStatus, TeamMember, SubTask, Comment } from "@/types/project";
import { getInitialProject, teamMembers } from "@/data/mockData";

interface ProjectContextType {
  project: Project;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  moveTask: (taskId: string, newStatus: TaskStatus, newIndex?: number) => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "comments" | "activities">) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addColumn: (title: string, id: TaskStatus) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addComment: (taskId: string, text: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterAssignee: string;
  setFilterAssignee: (a: string) => void;
  filterPriority: string;
  setFilterPriority: (p: string) => void;
  filterTag: string;
  setFilterTag: (t: string) => void;
  allTasks: Task[];
  filteredTasks: Task[];
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export const useProject = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within ProjectProvider");
  return ctx;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<Project>(getInitialProject());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterTag, setFilterTag] = useState("all");

  const allTasks = project.columns.flatMap(c => c.tasks);

  const filteredTasks = allTasks.filter(task => {
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterAssignee !== "all" && task.assignee?.id !== filterAssignee) return false;
    if (filterPriority !== "all" && task.priority !== filterPriority) return false;
    if (filterTag !== "all" && !task.tags.includes(filterTag)) return false;
    return true;
  });

  const moveTask = useCallback((taskId: string, newStatus: TaskStatus, newIndex?: number) => {
    setProject(prev => {
      let task: Task | undefined;
      const newColumns = prev.columns.map(col => ({
        ...col,
        tasks: col.tasks.filter(t => {
          if (t.id === taskId) { task = { ...t, status: newStatus }; return false; }
          return true;
        }),
      }));
      if (!task) return prev;
      return {
        ...prev,
        columns: newColumns.map(col => {
          if (col.id !== newStatus) return col;
          const tasks = [...col.tasks];
          if (newIndex !== undefined) tasks.splice(newIndex, 0, task!);
          else tasks.push(task!);
          return { ...col, tasks };
        }),
      };
    });
  }, []);

  const addTask = useCallback((taskData: Omit<Task, "id" | "createdAt" | "comments" | "activities">) => {
    const newTask: Task = {
      ...taskData,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString(),
      comments: [],
      activities: [{ id: `a${Date.now()}`, action: "Görev oluşturuldu", user: "Siz", timestamp: new Date().toISOString() }],
    };
    setProject(prev => ({
      ...prev,
      columns: prev.columns.map(col =>
        col.id === newTask.status ? { ...col, tasks: [...col.tasks, newTask] } : col
      ),
    }));
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setProject(prev => ({
      ...prev,
      columns: prev.columns.map(col => ({
        ...col,
        tasks: col.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t),
      })),
    }));
    setSelectedTask(prev => prev?.id === taskId ? { ...prev, ...updates } : prev);
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setProject(prev => ({
      ...prev,
      columns: prev.columns.map(col => ({ ...col, tasks: col.tasks.filter(t => t.id !== taskId) })),
    }));
    setSelectedTask(prev => prev?.id === taskId ? null : prev);
  }, []);

  const addColumn = useCallback((title: string, id: TaskStatus) => {
    setProject(prev => ({
      ...prev,
      columns: [...prev.columns, { id, title, tasks: [] }],
    }));
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setProject(prev => ({
      ...prev,
      columns: prev.columns.map(col => ({
        ...col,
        tasks: col.tasks.map(t =>
          t.id === taskId
            ? { ...t, subtasks: t.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st) }
            : t
        ),
      })),
    }));
    setSelectedTask(prev =>
      prev?.id === taskId
        ? { ...prev, subtasks: prev.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st) }
        : prev
    );
  }, []);

  const addComment = useCallback((taskId: string, text: string) => {
    const comment: Comment = {
      id: `c${Date.now()}`,
      author: teamMembers[0],
      text,
      createdAt: new Date().toISOString(),
    };
    updateTask(taskId, {});
    setProject(prev => ({
      ...prev,
      columns: prev.columns.map(col => ({
        ...col,
        tasks: col.tasks.map(t => t.id === taskId ? { ...t, comments: [...t.comments, comment] } : t),
      })),
    }));
    setSelectedTask(prev => prev?.id === taskId ? { ...prev, comments: [...prev.comments, comment] } : prev);
  }, []);

  const addSubtask = useCallback((taskId: string, title: string) => {
    const subtask: SubTask = { id: `st${Date.now()}`, title, completed: false };
    setProject(prev => ({
      ...prev,
      columns: prev.columns.map(col => ({
        ...col,
        tasks: col.tasks.map(t => t.id === taskId ? { ...t, subtasks: [...t.subtasks, subtask] } : t),
      })),
    }));
    setSelectedTask(prev => prev?.id === taskId ? { ...prev, subtasks: [...prev.subtasks, subtask] } : prev);
  }, []);

  return (
    <ProjectContext.Provider value={{
      project, selectedTask, setSelectedTask, moveTask, addTask, updateTask, deleteTask,
      addColumn, toggleSubtask, addComment, addSubtask,
      searchQuery, setSearchQuery, filterAssignee, setFilterAssignee,
      filterPriority, setFilterPriority, filterTag, setFilterTag,
      allTasks, filteredTasks,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
