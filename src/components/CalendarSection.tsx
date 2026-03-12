import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useTasks } from "@/hooks/useTasks";
import { parseISO, isSameDay } from "date-fns";

export function CalendarSection() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { tasks } = useTasks();

  const taskDates = tasks
    .filter(t => t.estimated_completion)
    .map(t => parseISO(t.estimated_completion!));

  const tasksForDate = selectedDate
    ? tasks.filter(t => t.estimated_completion && isSameDay(parseISO(t.estimated_completion!), selectedDate))
    : [];

  return (
    <div className="flex-1 overflow-auto px-4 md:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Takvim</h1>
        <p className="text-sm text-muted-foreground">Görev teslim tarihlerini takip edin</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="pointer-events-auto"
              modifiers={{ hasEvent: taskDates }}
              modifiersStyles={{ hasEvent: { fontWeight: 700, textDecoration: "underline", textDecorationColor: "hsl(var(--primary))" } }}
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CalendarDays size={16} />
              {selectedDate ? format(selectedDate, "d MMMM yyyy, EEEE", { locale: tr }) : "Bir tarih seçin"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasksForDate.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Bu tarihte teslim edilecek görev yok</p>
            ) : (
              <div className="space-y-2">
                {tasksForDate.map(task => (
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
      </div>
    </div>
  );
}
