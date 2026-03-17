import { useAuth } from "@/context/AuthContext";
import { useDailyReportRequests } from "@/hooks/useDailyReportRequests";
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";

export function DailyReportAlert() {
  const { profile } = useAuth();
  const { data: requests } = useDailyReportRequests();

  const myActiveRequest = requests?.find(
    (r) => r.user_id === profile?.user_id && r.is_active
  );

  if (!myActiveRequest) return null;

  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-amber-500/15 text-amber-600">
          <Bell size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            Günlük Bildirim Talebi
          </p>
          <p className="text-xs text-muted-foreground">
            Admin sizden günlük rapor/bildirim bekliyor. Lütfen bugünkü ilerlemenizi paylaşın.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
