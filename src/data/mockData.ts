import { Project, TeamMember, Task, Column } from "@/types/project";

export const teamMembers: TeamMember[] = [
  { id: "u1", name: "Ayşe Yılmaz", avatar: "AY", email: "ayse@company.com", role: "Product Manager" },
  { id: "u2", name: "Mehmet Kaya", avatar: "MK", email: "mehmet@company.com", role: "Developer" },
  { id: "u3", name: "Elif Demir", avatar: "ED", email: "elif@company.com", role: "Designer" },
  { id: "u4", name: "Can Öztürk", avatar: "CÖ", email: "can@company.com", role: "Developer" },
  { id: "u5", name: "Zeynep Arslan", avatar: "ZA", email: "zeynep@company.com", role: "QA Engineer" },
  { id: "u6", name: "Ali Yıldırım", avatar: "AY", email: "ali@company.com", role: "DevOps Engineer" },
  { id: "u7", name: "Selin Aktaş", avatar: "SA", email: "selin@company.com", role: "Frontend Developer" },
  { id: "u8", name: "Burak Şahin", avatar: "BŞ", email: "burak@company.com", role: "Backend Developer" },
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
    assignee: teamMembers[7], dueDate: undefined, tags: ["backend", "database"],
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
    subtasks: [{ id: "st8", title: "Header responsive", completed: true }, { id: "st9", title: "Sidebar responsive", completed: false }],
    comments: [{ id: "c2", author: teamMembers[3], text: "Tablet breakpoint'i de ekleyelim", createdAt: "2026-03-08T15:00:00Z" }],
    activities: [{ id: "a3", action: "Göreve başladı", user: "Elif Demir", timestamp: "2026-03-07T09:00:00Z" }],
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
  {
    id: "t9", title: "CI/CD pipeline kurulumu", description: "GitHub Actions ile otomatik build ve deploy pipeline'ı oluştur.", status: "in_progress", priority: "high",
    assignee: teamMembers[5], dueDate: "2026-03-11", tags: ["devops", "ci-cd"],
    subtasks: [{ id: "st10", title: "Build step", completed: true }, { id: "st11", title: "Test step", completed: true }, { id: "st12", title: "Deploy step", completed: false }],
    comments: [{ id: "c3", author: teamMembers[0], text: "Staging environment da ekleyelim", createdAt: "2026-03-09T11:00:00Z" }],
    activities: [{ id: "a4", action: "Göreve başladı", user: "Ali Yıldırım", timestamp: "2026-03-08T09:00:00Z" }],
    createdAt: "2026-03-07T09:00:00Z",
  },
  {
    id: "t10", title: "Dark mode implementasyonu", description: "Tema geçişi için dark mode desteği ekle.", status: "todo", priority: "medium",
    assignee: teamMembers[6], dueDate: "2026-03-22", tags: ["frontend", "design"],
    subtasks: [{ id: "st13", title: "CSS variables tanımla", completed: false }, { id: "st14", title: "Toggle component", completed: false }],
    comments: [], activities: [],
    createdAt: "2026-03-08T09:00:00Z",
  },
  {
    id: "t11", title: "E-posta şablonları", description: "Transactional e-posta şablonlarını tasarla ve kodla.", status: "done", priority: "medium",
    assignee: teamMembers[2], dueDate: "2026-03-04", tags: ["design", "backend"],
    subtasks: [{ id: "st15", title: "Hoşgeldin e-postası", completed: true }, { id: "st16", title: "Şifre sıfırlama", completed: true }],
    comments: [{ id: "c4", author: teamMembers[0], text: "Çok temiz olmuş 👏", createdAt: "2026-03-04T16:00:00Z" }],
    activities: [{ id: "a5", action: "Görevi tamamladı", user: "Elif Demir", timestamp: "2026-03-04T17:00:00Z" }],
    createdAt: "2026-03-01T09:00:00Z",
  },
  {
    id: "t12", title: "Performans monitoring", description: "Sentry ve Datadog entegrasyonu yap.", status: "backlog", priority: "medium",
    assignee: teamMembers[5], dueDate: undefined, tags: ["devops", "monitoring"],
    subtasks: [], comments: [], activities: [],
    createdAt: "2026-03-08T09:00:00Z",
  },
  {
    id: "t13", title: "Kullanıcı profil sayfası", description: "Profil düzenleme, avatar yükleme ve tercihler sayfasını oluştur.", status: "in_progress", priority: "medium",
    assignee: teamMembers[6], dueDate: "2026-03-16", tags: ["frontend", "feature"],
    subtasks: [{ id: "st17", title: "Profil formu", completed: true }, { id: "st18", title: "Avatar yükleme", completed: false }],
    comments: [], activities: [{ id: "a6", action: "Göreve başladı", user: "Selin Aktaş", timestamp: "2026-03-09T09:00:00Z" }],
    createdAt: "2026-03-08T09:00:00Z",
  },
  {
    id: "t14", title: "API rate limiting", description: "API endpoint'lerine rate limiting mekanizması ekle.", status: "todo", priority: "high",
    assignee: teamMembers[7], dueDate: "2026-03-19", tags: ["backend", "security"],
    subtasks: [], comments: [], activities: [],
    createdAt: "2026-03-09T09:00:00Z",
  },
  {
    id: "t15", title: "Erişilebilirlik (a11y) denetimi", description: "WCAG 2.1 standartlarına uygunluk kontrolü yap.", status: "done", priority: "low",
    assignee: teamMembers[4], dueDate: "2026-03-06", tags: ["testing", "a11y"],
    subtasks: [{ id: "st19", title: "Renk kontrastı", completed: true }, { id: "st20", title: "Klavye navigasyonu", completed: true }, { id: "st21", title: "Screen reader testi", completed: true }],
    comments: [{ id: "c5", author: teamMembers[4], text: "Tüm sayfalar WCAG AA standartlarını karşılıyor.", createdAt: "2026-03-06T14:00:00Z" }],
    activities: [{ id: "a7", action: "Görevi tamamladı", user: "Zeynep Arslan", timestamp: "2026-03-06T15:00:00Z" }],
    createdAt: "2026-03-02T09:00:00Z",
  },
];

export interface ProjectInfo {
  id: string;
  name: string;
  description: string;
  color: string;
  progress: number;
  memberCount: number;
  taskCount: number;
  status: "active" | "completed" | "on-hold";
  dueDate: string;
}

export const projectsList: ProjectInfo[] = [
  { id: "p1", name: "ProTrack v2.0", description: "Yeni nesil proje takip platformu", color: "indigo", progress: 45, memberCount: 8, taskCount: 15, status: "active", dueDate: "2026-04-15" },
  { id: "p2", name: "Mobil Uygulama", description: "iOS ve Android native uygulama", color: "emerald", progress: 72, memberCount: 5, taskCount: 24, status: "active", dueDate: "2026-05-01" },
  { id: "p3", name: "Marketing Web Sitesi", description: "Yeni kurumsal web sitesi redesign", color: "amber", progress: 100, memberCount: 3, taskCount: 12, status: "completed", dueDate: "2026-02-28" },
  { id: "p4", name: "API Gateway", description: "Mikroservis API gateway altyapısı", color: "rose", progress: 30, memberCount: 4, taskCount: 18, status: "active", dueDate: "2026-06-01" },
  { id: "p5", name: "Data Analytics Dashboard", description: "İş zekası ve raporlama paneli", color: "cyan", progress: 15, memberCount: 3, taskCount: 9, status: "on-hold", dueDate: "2026-07-01" },
];

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "deadline" | "meeting" | "milestone" | "review";
  project: string;
  assignee?: TeamMember;
  time?: string;
}

export const calendarEvents: CalendarEvent[] = [
  { id: "e1", title: "Sprint Planning", date: "2026-03-09", type: "meeting", project: "ProTrack v2.0", time: "10:00" },
  { id: "e2", title: "API Auth teslim tarihi", date: "2026-03-12", type: "deadline", project: "ProTrack v2.0", assignee: teamMembers[1] },
  { id: "e3", title: "UI Review toplantısı", date: "2026-03-10", type: "review", project: "ProTrack v2.0", time: "14:00" },
  { id: "e4", title: "v2.0 Beta Release", date: "2026-03-20", type: "milestone", project: "ProTrack v2.0" },
  { id: "e5", title: "Responsive düzenlemeler", date: "2026-03-14", type: "deadline", project: "ProTrack v2.0", assignee: teamMembers[2] },
  { id: "e6", title: "CI/CD pipeline teslim", date: "2026-03-11", type: "deadline", project: "ProTrack v2.0", assignee: teamMembers[5] },
  { id: "e7", title: "Daily Standup", date: "2026-03-09", type: "meeting", project: "ProTrack v2.0", time: "09:30" },
  { id: "e8", title: "Daily Standup", date: "2026-03-10", type: "meeting", project: "ProTrack v2.0", time: "09:30" },
  { id: "e9", title: "Daily Standup", date: "2026-03-11", type: "meeting", project: "ProTrack v2.0", time: "09:30" },
  { id: "e10", title: "Code Review Session", date: "2026-03-13", type: "review", project: "ProTrack v2.0", time: "15:00" },
  { id: "e11", title: "Profil sayfası teslim", date: "2026-03-16", type: "deadline", project: "ProTrack v2.0", assignee: teamMembers[6] },
  { id: "e12", title: "Sprint Retrospective", date: "2026-03-21", type: "meeting", project: "ProTrack v2.0", time: "16:00" },
  { id: "e13", title: "Rate limiting teslim", date: "2026-03-19", type: "deadline", project: "ProTrack v2.0", assignee: teamMembers[7] },
  { id: "e14", title: "Mobil App Demo", date: "2026-03-17", type: "milestone", project: "Mobil Uygulama" },
  { id: "e15", title: "Dark mode teslim", date: "2026-03-22", type: "deadline", project: "ProTrack v2.0", assignee: teamMembers[6] },
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
