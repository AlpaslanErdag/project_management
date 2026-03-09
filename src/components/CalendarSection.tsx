import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { calendarEvents, CalendarEvent } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, Target, MessageSquare, AlertCircle } from "lucide-react";
import { format, isSameDay, parseISO } from "date-fns";
import { tr } from "date-fns/locale";

const typeConfig: Record<CalendarEvent["type"], { label: string; icon: React.ElementType; className: string }> = {
  deadline: { label: "Teslim", icon: AlertCircle, className: "bg-rose-500/15 text-rose-600 border-rose-500/20" },
  meeting: { label: "Toplantı", icon: Clock, className: "bg-primary/15 text-primary border-primary/20" },
  milestone: { label: "Milestone", icon: Target, className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" },
  review: { label: "Review", icon: MessageSquare, className: "bg-amber-500/15 text-amber-600 border-amber-500/20" },
};

export function CalendarSection() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date("2026-03-09"));

  const eventsForDate = selectedDate
    ? calendarEvents.filter(e => isSameDay(parseISO(e.date), selectedDate))
    : [];

  const eventDates = calendarEvents.map(e => parseISO(e.date));

  const upcomingEvents = calendarEvents
    .filter(e => parseISO(e.date) >= new Date("2026-03-09"))
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 8);

  return (
    <div className="flex-1 overflow-auto px-4 md:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Takvim</h1>
        <p className="text-sm text-muted-foreground">Etkinliklerinizi ve teslim tarihlerinizi takip edin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="pointer-events-auto"
              modifiers={{ hasEvent: eventDates }}
              modifiersStyles={{ hasEvent: { fontWeight: 700, textDecoration: "underline", textDecorationColor: "hsl(var(--primary))" } }}
            />
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CalendarDays size={16} />
                {selectedDate ? format(selectedDate, "d MMMM yyyy, EEEE", { locale: tr }) : "Bir tarih seçin"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventsForDate.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Bu tarihte etkinlik yok</p>
              ) : (
                <div className="space-y-3">
                  {eventsForDate.map(event => {
                    const config = typeConfig[event.type];
                    const Icon = config.icon;
                    return (
                      <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                        <div className="mt-0.5">
                          <Icon size={16} className="text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{event.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={`text-[10px] ${config.className}`}>{config.label}</Badge>
                            <span className="text-xs text-muted-foreground">{event.project}</span>
                            {event.time && <span className="text-xs text-muted-foreground">• {event.time}</span>}
                          </div>
                          {event.assignee && (
                            <p className="text-xs text-muted-foreground mt-1">👤 {event.assignee.name}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Yaklaşan Etkinlikler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingEvents.map(event => {
                  const config = typeConfig[event.type];
                  return (
                    <div key={event.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedDate(parseISO(event.date))}>
                      <div className="flex items-center gap-3 min-w-0">
                        <Badge variant="outline" className={`text-[10px] shrink-0 ${config.className}`}>{config.label}</Badge>
                        <span className="text-sm truncate">{event.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {format(parseISO(event.date), "d MMM", { locale: tr })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
