import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DailyReportRequest {
  id: string;
  user_id: string;
  requested_by: string;
  is_active: boolean;
  created_at: string;
}

export function useDailyReportRequests() {
  return useQuery({
    queryKey: ["daily-report-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_report_requests")
        .select("*");
      if (error) throw error;
      return data as DailyReportRequest[];
    },
  });
}

export function useDailyReportActions() {
  const queryClient = useQueryClient();

  const toggleRequest = useMutation({
    mutationFn: async ({ userId, requestedBy, currentlyActive, existingId }: {
      userId: string;
      requestedBy: string;
      currentlyActive: boolean;
      existingId?: string;
    }) => {
      if (existingId) {
        const { error } = await supabase
          .from("daily_report_requests")
          .update({ is_active: !currentlyActive })
          .eq("id", existingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("daily_report_requests")
          .insert({ user_id: userId, requested_by: requestedBy, is_active: true });
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["daily-report-requests"] }),
  });

  return { toggleRequest };
}
