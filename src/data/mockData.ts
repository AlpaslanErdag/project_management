import { Project, TeamMember, Task, Column } from "@/types/project";

export const teamMembers: TeamMember[] = [
  { id: "u1", name: "Ayşe Yılmaz", avatar: "AY", email: "ayse@company.com", role: "Product Manager" },
  { id: "u2", name: "Mehmet Kaya", avatar: "MK", email: "mehmet@company.com", role: "Developer" },
  { id: "u3", name: "Elif Demir", avatar: "ED", email: "elif@company.com", role: "Designer" },
  { id: "u4", name: "Can Öztürk", avatar: "CÖ", email: "can@company.com", role: "Developer" },
  { id: "u5", name: "Zeynep Arslan", avatar: "ZA", email: "zeynep@company.com", role: "QA Engineer" },
];

const createTasks = (): Task[] => [
  {
    id: "t1", title: "Kullanıcı giriş sayfası tasarımı", description: "Login ve register sayfalarının UI tasarımını Figma'da oluştur.", status: "done", priority: "high",
    assignee: teamMembers[2], dueDate: "2026-03-05", tags: ["design", "auth"],
    subtasks: [{ id: "st1", title: "Wireframe çiz", completed: true }, { id: "st2", title: "Renk paleti belirle", completed: true }],
    comments: [{ id: "c1", author: teamMembers[0], text: "Harika görünüyor!", createdAt: "2026-03-04T10:00:00Z" }],
    activities: [{ id: "a1", action: "Görevi tamamladı", user: "Elif Demir", timestamp: "2026-03-05T14:00:00Z" }],
    createdAt: "2026-03-01T09:00:00Z",
  },
  {
    id: "t2", title: "API authentication endpoint'leri", description: "JWT tabanlı authentication API'sini implement et.", status: "in_progress", priority: "high",
    assignee: teamMembers[1], dueDate: "2026-03-12", tags: ["backend", "auth"],
    subtasks: [{ id: "st3", title: "Login endpoint", completed: true }, { id: "st4", title: "Register endpoint", completed: false }, { id: "st5", title: "Token refresh", completed: false }],
    comments: [], activities: [{ id: "a2", action: "Göreve başladı", user: "Mehmet Kaya", timestamp: "2026-03-06T09:00:00Z" }],
    createdAt: "2026-03-02T09:00:00Z",
  },
  {
    id: "t3", title: "Dashboard analitik kartları", description: "Ana dashboard'daki KPI kartlarını oluştur.", status: "todo", priority: "medium",
    assignee: teamMembers[3], dueDate: "2026-03-15", tags: ["frontend", "dashboard"],
    subtasks: [], comments: [], activities: [],
    createdAt: "2026-03-03T09:00:00Z",
  },
  {
    id: "t4", title: "Veritabanı şeması optimizasyonu", description: "Sorgu performansını artırmak için indeksleri gözden geçir.", status: "backlog", priority: "low",
    assignee: undefined, dueDate: undefined, tags: ["backend", "database"],
    subtasks: [], comments: [], activities: [],
    createdAt: "2026-03-04T09:00:00Z",
  },
  {
    id: "t5", title: "Bildirim sistemi", description: "Real-time bildirim altyapısını kur.", status: "todo", priority: "high",
    assignee: teamMembers[1], dueDate: "2026-03-18", tags: ["backend", "feature"],
    subtasks: [{ id: "st6", title: "WebSocket bağlantısı", completed: false }, { id: "st7", title: "Bildirim UI", completed: false }],
    comments: [], activities: [],
    createdAt: "2026-03-05T09:00:00Z",
  },
  {
    id: "t6", title: "Mobil responsive düzenlemeler", description: "Tüm sayfaları mobil uyumlu hale getir.", status: "in_progress", priority: "medium",
    assignee: teamMembers[2], dueDate: "2026-03-14", tags: ["frontend", "responsive"],
    subtasks: [], comments: [], activities: [],
    createdAt: "2026-03-05T09:00:00Z",
  },
  {
    id: "t7", title: "Unit test coverage artırma", description: "Test coverage oranını %80'in üzerine çıkar.", status: "backlog", priority: "low",
    assignee: teamMembers[4], dueDate: undefined, tags: ["testing"],
    subtasks: [], comments: [], activities: [],
    createdAt: "2026-03-06T09:00:00Z",
  },
  {
    id: "t8", title: "Dosya yükleme modülü", description: "Drag-drop destekli dosya yükleme bileşeni.", status: "todo", priority: "medium",
    assignee: teamMembers[3], dueDate: "2026-03-20", tags: ["frontend", "feature"],
    subtasks: [], comments: [], activities: [],
    createdAt: "2026-03-07T09:00:00Z",
  },
];

export const defaultProject: Project = {
  id: "p1",
  name: "ProTrack v2.0",
  description: "Yeni nesil proje takip platformu",
  color: "indigo",
  members: teamMembers,
  columns: [
    { id: "backlog", title: "Backlog", tasks: [] },
    { id: "todo", title: "To Do", tasks: [] },
    { id: "in_progress", title: "In Progress", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
  ],
};

export function getInitialProject(): Project {
  const tasks = createTasks();
  const project = { ...defaultProject };
  project.columns = project.columns.map(col => ({
    ...col,
    tasks: tasks.filter(t => t.status === col.id),
  }));
  return project;
}
