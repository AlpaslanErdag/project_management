import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Palmtree } from "lucide-react";
import { format, parseISO, isSameDay, isWithinInterval, eachDayOfInterval } from "date-fns";
import { tr } from "date-fns/locale";
import { useTasks } from "@/hooks/useTasks";
import { useLeaveRequests } from "@/hooks/useLeave";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function CalendarSection() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { tasks } = useTasks();
  const { data: leaveRequests } = useLeaveRequests();

  // Fetch profiles for names
  const { data: profiles } = useQuery({
    queryKey: ["profiles-for-calendar"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("user_id, full_name");
      if (error) throw error;
      return data;
    },
  });

  const approvedLeaves = leaveRequests?.filter((r) => r.status === "approved") ?? [];

  // Task dates
  const taskDates = tasks
    .filter((t) => t.estimated_completion)
    .map((t) => parseISO(t.estimated_completion!));

  // Leave dates (all days in approved ranges)
  const leaveDates = approvedLeaves.flatMap((l) => {
    try {
      return eachDayOfInterval({ start: parseISO(l.start_date), end: parseISO(l.end_date) });
    } catch {
      return [];
    }
  });

  const tasksForDate = selectedDate
    ? tasks.filter((t) => t.estimated_completion && isSameDay(parseISO(t.estimated_completion!), selectedDate))
    : [];

  const leavesForDate = selectedDate
    ? approvedLeaves.filter((l) => {
        try {
          return isWithinInterval(selectedDate, { start: parseISO(l.start_date), end: parseISO(l.end_date) });
        } catch {
          return false;
        }
      })
    : [];

  const getUserName = (userId: string) =>
    profiles?.find((p) => p.user_id === userId)?.full_name ?? "—";

  return (
    <div className="flex-1 overflow-auto px-4 md:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Takvim</h1>
        <p className="text-sm text-muted-foreground">Görev teslim tarihleri ve onaylanan izinleri takip edin</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="pointer-events-auto"
              modifiers={{
                hasEvent: taskDates,
                hasLeave: leaveDates,
              }}
              modifiersStyles={{
                hasEvent: { fontWeight: 700, textDecoration: "underline", textDecorationColor: "hsl(var(--primary))" },
                hasLeave: { backgroundColor: "hsl(142 76% 36% / 0.15)", borderRadius: "50%" },
              }}
            />
            <div className="flex items-center gap-4 mt-3 px-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border-2 border-primary" />
                Görev
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500/30" />
                İzin
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {/* Tasks card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CalendarDays size={16} />
                {selectedDate ? format(selectedDate, "d MMMM yyyy, EEEE", { locale: tr }) : "Bir tarih seçin"} — Görevler
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasksForDate.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Bu tarihte teslim edilecek görev yok</p>
              ) : (
                <div className="space-y-2">
                  {tasksForDate.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div>
                        <p className="text-sm font-medium">{task.project_or_request}</p>
                        <p className="text-xs text-muted-foreground">{task.assigned_personnel ?? "Atanmamış"}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{task.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Leaves card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Palmtree size={16} className="text-emerald-500" />
                {selectedDate ? format(selectedDate, "d MMMM yyyy", { locale: tr }) : ""} — Onaylanan İzinler
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leavesForDate.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Bu tarihte onaylanan izin yok</p>
              ) : (
                <div className="space-y-2">
                  {leavesForDate.map((leave) => (
                    <div key={leave.id} className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10">
                      <div>
                        <p className="text-sm font-medium">{getUserName(leave.user_id)}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(leave.start_date), "d MMM", { locale: tr })} — {format(parseISO(leave.end_date), "d MMM yyyy", { locale: tr })}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-500/20 text-[10px]">
                        Onaylı
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
