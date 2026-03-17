import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface LeavePeriod {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
}

export interface LeaveRequest {
  id: string;
  user_id: string;
  leave_period_id: string;
  start_date: string;
  end_date: string;
  note: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useLeavePeriods() {
  return useQuery({
    queryKey: ["leave-periods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leave_periods")
        .select("*")
        .order("start_date", { ascending: true });
      if (error) throw error;
      return data as LeavePeriod[];
    },
  });
}

export function useLeaveRequests() {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ["leave-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leave_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as LeaveRequest[];
    },
    enabled: !!profile,
  });
}

export function useLeaveActions() {
  const queryClient = useQueryClient();

  const createPeriod = useMutation({
    mutationFn: async (period: { name: string; start_date: string; end_date: string; created_by: string }) => {
      const { error } = await supabase.from("leave_periods").insert(period);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leave-periods"] }),
  });

  const deletePeriod = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leave_periods").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leave-periods"] }),
  });

  const togglePeriod = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("leave_periods").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leave-periods"] }),
  });

  const createLeaveRequest = useMutation({
    mutationFn: async (req: { user_id: string; leave_period_id: string; start_date: string; end_date: string; note?: string }) => {
      const { error } = await supabase.from("leave_requests").insert(req);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leave-requests"] }),
  });

  const updateLeaveStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("leave_requests").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leave-requests"] }),
  });

  const deleteLeaveRequest = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leave_requests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leave-requests"] }),
  });

  return { createPeriod, deletePeriod, togglePeriod, createLeaveRequest, updateLeaveStatus, deleteLeaveRequest };
}
