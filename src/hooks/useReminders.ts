import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export type ReminderRow = {
  id: string;
  created_by: string;
  target_type: "team" | "user";
  target_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export function useReminders() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const remindersQuery = useQuery({
    queryKey: ["reminders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ReminderRow[];
    },
    enabled: !!user,
  });

  const sendReminder = useMutation({
    mutationFn: async (reminder: {
      target_type: "team" | "user";
      target_id: string;
      message: string;
    }) => {
      const { error } = await supabase.from("reminders").insert({
        ...reminder,
        created_by: user!.id,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reminders"] }),
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("reminders")
        .update({ is_read: true } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reminders"] }),
  });

  const unreadCount = remindersQuery.data?.filter((r) => !r.is_read).length ?? 0;

  return {
    reminders: remindersQuery.data ?? [],
    unreadCount,
    sendReminder,
    markAsRead,
    isLoading: remindersQuery.isLoading,
  };
}
