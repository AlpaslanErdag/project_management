export type Priority = "low" | "medium" | "high";
export type TaskStatus = "backlog" | "todo" | "in_progress" | "done";

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  author: TeamMember;
  text: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  action: string;
  user: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee?: TeamMember;
  dueDate?: string;
  tags: string[];
  subtasks: SubTask[];
  comments: Comment[];
  activities: Activity[];
  createdAt: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  members: TeamMember[];
  columns: Column[];
}
