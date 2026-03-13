import { useReminders } from "@/hooks/useReminders";
import { useAuth } from "@/context/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export function RemindersPopover() {
  const { reminders, unreadCount, markAsRead } = useReminders();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b">
          <h3 className="text-sm font-semibold">Hatırlatmalar</h3>
        </div>
        <div className="max-h-64 overflow-auto">
          {reminders.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">Hatırlatma yok</p>
          ) : (
            reminders.map((r) => (
              <div
                key={r.id}
                className={`p-3 border-b last:border-0 text-sm ${!r.is_read ? "bg-primary/5" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="flex-1">{r.message}</p>
                  {!r.is_read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => markAsRead.mutate(r.id)}
                    >
                      <Check size={12} />
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: tr })}
                </p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
