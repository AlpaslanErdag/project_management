import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import { useTeams } from "@/hooks/useTeams";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Trash2, Shield, ShieldCheck, Mail, Pencil, Check, X } from "lucide-react";

type ProfileRow = {
  id: string;
  user_id: string;
  full_name: string;
  email: string | null;
  team_id: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

type UserRoleRow = {
  id: string;
  user_id: string;
  role: "admin" | "member";
};

function EditableTeamName({ teamId, currentName }: { teamId: string; currentName: string }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentName);
  const queryClient = useQueryClient();

  const save = async () => {
    if (!name.trim() || name.trim() === currentName) {
      setName(currentName);
      setEditing(false);
      return;
    }
    const { error } = await supabase.from("teams").update({ name: name.trim() }).eq("id", teamId);
    if (error) {
      toast({ title: "Hata", description: "Takım adı güncellenemedi.", variant: "destructive" });
      setName(currentName);
    } else {
      toast({ title: "Başarılı", description: "Takım adı güncellendi." });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    }
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-6 text-[10px] w-24 px-1"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") { setName(currentName); setEditing(false); }
          }}
        />
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={save}><Check size={10} /></Button>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => { setName(currentName); setEditing(false); }}><X size={10} /></Button>
      </div>
    );
  }

  return (
    <Badge variant="outline" className="text-[10px] cursor-pointer gap-1 hover:bg-secondary" onClick={() => setEditing(true)}>
      {currentName}
      <Pencil size={8} />
    </Badge>
  );
}

export function TeamSection() {
  const { isAdmin } = useAuth();
  const { tasks } = useTasks();
  const { data: teams } = useTeams();
  const queryClient = useQueryClient();

  const { data: profiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data as ProfileRow[];
    },
  });

  const { data: userRoles } = useQuery({
    queryKey: ["all-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data as UserRoleRow[];
    },
    enabled: isAdmin,
  });

  const toggleRole = useMutation({
    mutationFn: async ({ userId, currentRole }: { userId: string; currentRole: string }) => {
      const newRole = currentRole === "admin" ? "member" : "admin";
      const { error } = await supabase.from("user_roles").update({ role: newRole }).eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-user-roles"] });
      toast({ title: "Başarılı", description: "Kullanıcı rolü güncellendi." });
    },
  });

  const removeUser = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.from("profiles").delete().eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["all-user-roles"] });
      toast({ title: "Başarılı", description: "Kullanıcı kaldırıldı." });
    },
  });

  const getUserRole = (userId: string) =>
    userRoles?.find((r) => r.user_id === userId)?.role ?? "member";

  const getTeamName = (teamId: string | null) =>
    teams?.find((t) => t.id === teamId)?.name ?? "—";

  const getMemberStats = (userId: string, teamId: string | null) => {
    const memberTasks = tasks.filter((t) => t.team_id === teamId);
    return {
      total: memberTasks.length,
      done: memberTasks.filter((t) => t.status === "tamamlandi").length,
      inProgress: memberTasks.filter((t) => t.status === "devam_ediyor").length,
    };
  };

  const initials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="flex-1 overflow-auto px-4 md:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Ekip</h1>
          <p className="text-sm text-muted-foreground">{profiles?.length ?? 0} ekip üyesi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {profiles?.map((member) => {
          const role = getUserRole(member.user_id);
          const stats = getMemberStats(member.user_id, member.team_id);
          return (
            <Card key={member.id} className="hover:shadow-md transition-shadow group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center text-sm font-semibold text-primary">
                      {initials(member.full_name)}
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">{member.full_name}</CardTitle>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Badge
                          variant="outline"
                          className={
                            role === "admin"
                              ? "bg-amber-500/15 text-amber-600 border-amber-500/20 text-[10px]"
                              : "bg-primary/15 text-primary border-primary/20 text-[10px]"
                          }
                        >
                          {role === "admin" ? "Admin" : "Üye"}
                        </Badge>
                        {isAdmin && member.team_id ? (
                          <EditableTeamName teamId={member.team_id} currentName={getTeamName(member.team_id)} />
                        ) : (
                          <Badge variant="outline" className="text-[10px]">{getTeamName(member.team_id)}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7"
                        title={role === "admin" ? "Üye yap" : "Admin yap"}
                        onClick={() => toggleRole.mutate({ userId: member.user_id, currentRole: role })}
                      >
                        {role === "admin" ? <ShieldCheck size={14} className="text-amber-500" /> : <Shield size={14} />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"
                        title="Kullanıcıyı kaldır"
                        onClick={() => removeUser.mutate(member.user_id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {member.email && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail size={12} />
                    <span>{member.email}</span>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/50">
                    <span className="text-sm font-semibold">{stats.done}</span>
                    <span className="text-[10px] text-muted-foreground">Bitti</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/50">
                    <span className="text-sm font-semibold">{stats.inProgress}</span>
                    <span className="text-[10px] text-muted-foreground">Devam</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/50">
                    <span className="text-sm font-semibold">{stats.total}</span>
                    <span className="text-[10px] text-muted-foreground">Toplam</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
