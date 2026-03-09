import * as XLSX from "xlsx";
import type { TaskRow } from "@/hooks/useTasks";

const COLUMN_MAP = {
  "Proje/Talep": "project_or_request",
  "Görevlendirilen Personel": "assigned_personnel",
  "Tahmini Bitiş Süresi": "estimated_completion",
  "Durum": "status",
  "Proje": "project_name",
  "Haftalık İlerleme": "weekly_progress",
} as const;

const REVERSE_MAP: Record<string, string> = {
  project_or_request: "Proje/Talep",
  assigned_personnel: "Görevlendirilen Personel",
  estimated_completion: "Tahmini Bitiş Süresi",
  status: "Durum",
  project_name: "Proje",
  weekly_progress: "Haftalık İlerleme",
  created_at: "Oluşturulma Tarihi",
};

export function exportTasksToExcel(tasks: TaskRow[], teamName: string = "Görevler") {
  const rows = tasks.map(t => ({
    "Proje/Talep": t.project_or_request,
    "Görevlendirilen Personel": t.assigned_personnel ?? "",
    "Tahmini Bitiş Süresi": t.estimated_completion ?? "",
    "Durum": t.status,
    "Proje": t.project_name ?? "",
    "Haftalık İlerleme": t.weekly_progress ?? "",
    "Oluşturulma Tarihi": new Date(t.created_at).toLocaleDateString("tr-TR"),
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, teamName);

  // Auto-width columns
  const colWidths = Object.keys(rows[0] || {}).map(key => ({
    wch: Math.max(key.length, ...rows.map(r => String((r as Record<string, string>)[key] || "").length)) + 2,
  }));
  ws["!cols"] = colWidths;

  XLSX.writeFile(wb, `${teamName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export interface ImportedTask {
  project_or_request: string;
  assigned_personnel?: string;
  estimated_completion?: string;
  status: string;
  project_name?: string;
  weekly_progress?: string;
}

export function parseExcelFile(file: File): Promise<ImportedTask[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonRows = XLSX.utils.sheet_to_json<Record<string, string>>(ws);

        const tasks: ImportedTask[] = jsonRows.map(row => ({
          project_or_request: row["Proje/Talep"] || row["project_or_request"] || row["Proje ya da talep"] || "",
          assigned_personnel: row["Görevlendirilen Personel"] || row["assigned_personnel"] || "",
          estimated_completion: row["Tahmini Bitiş Süresi"] || row["estimated_completion"] || "",
          status: row["Durum"] || row["status"] || "devam_ediyor",
          project_name: row["Proje"] || row["project_name"] || "",
          weekly_progress: row["Haftalık İlerleme"] || row["weekly_progress"] || "",
        })).filter(t => t.project_or_request);

        resolve(tasks);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
