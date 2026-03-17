import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import { useTeams } from "@/hooks/useTeams";
import { useDailyReportRequests, useDailyReportActions } from "@/hooks/useDailyReportRequests";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Trash2, Shield, ShieldCheck, Mail, Pencil, Check, X, Plus, UserPlus, Users, Bell } from "lucide-react";

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

function TeamManagementSection() {
  const { data: teams } = useTeams();
  const queryClient = useQueryClient();
  const [newTeamName, setNewTeamName] = useState("");
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const createTeam = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from("teams").insert({ name });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      setNewTeamName("");
      toast({ title: "Başarılı", description: "Yeni takım oluşturuldu." });
    },
    onError: () => toast({ title: "Hata", description: "Takım oluşturulamadı.", variant: "destructive" }),
  });

  const renameTeam = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase.from("teams").update({ name }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      setEditingTeamId(null);
      toast({ title: "Başarılı", description: "Takım adı güncellendi." });
    },
  });

  const deleteTeam = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("teams").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast({ title: "Başarılı", description: "Takım silindi." });
    },
    onError: () => toast({ title: "Hata", description: "Takım silinemedi. Takıma bağlı kullanıcılar veya görevler olabilir.", variant: "destructive" }),
  });

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Users size={16} /> Takım Yönetimi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Yeni takım adı"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && newTeamName.trim()) createTeam.mutate(newTeamName.trim());
            }}
          />
          <Button size="sm" className="h-8 gap-1" onClick={() => newTeamName.trim() && createTeam.mutate(newTeamName.trim())} disabled={!newTeamName.trim()}>
            <Plus size={14} /> Ekle
          </Button>
        </div>
        <div className="space-y-1">
          {teams?.map((team) => (
            <div key={team.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              {editingTeamId === team.id ? (
                <div className="flex items-center gap-1 flex-1">
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="h-7 text-sm flex-1"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && editingName.trim()) renameTeam.mutate({ id: team.id, name: editingName.trim() });
                      if (e.key === "Escape") setEditingTeamId(null);
                    }}
                  />
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => editingName.trim() && renameTeam.mutate({ id: team.id, name: editingName.trim() })}>
                    <Check size={14} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingTeamId(null)}>
                    <X size={14} />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="text-sm font-medium">{team.name}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingTeamId(team.id); setEditingName(team.name); }}>
                      <Pencil size={14} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                          <Trash2 size={14} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Takımı Sil</AlertDialogTitle>
                          <AlertDialogDescription>
                            "{team.name}" takımını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz. Takıma bağlı kullanıcılar ve görevler varsa silme işlemi başarısız olabilir.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteTeam.mutate(team.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Sil
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CreateUserDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [submitting, setSubmitting] = useState(false);
  const { data: teams } = useTeams();
  const queryClient = useQueryClient();

  const handleCreate = async () => {
    if (!email || !password || !fullName || !teamId) {
      toast({ title: "Hata", description: "Tüm alanları doldurun.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      // Use edge function to create user as admin
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("admin-create-user", {
        body: { email, password, fullName, teamId, role },
      });
      if (res.error) throw new Error(res.error.message);
      if (res.data?.error) throw new Error(res.data.error);
      
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["all-user-roles"] });
      toast({ title: "Başarılı", description: `${fullName} kullanıcısı oluşturuldu.` });
      onOpenChange(false);
      setEmail(""); setPassword(""); setFullName(""); setTeamId(""); setRole("member");
    } catch (err: any) {
      toast({ title: "Hata", description: err.message || "Kullanıcı oluşturulamadı.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Kullanıcı Oluştur</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Ad Soyad" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Şifre (min 6 karakter)" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} />
          <Select value={teamId} onValueChange={setTeamId}>
            <SelectTrigger><SelectValue placeholder="Takım seçin" /></SelectTrigger>
            <SelectContent>
              {teams?.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={role} onValueChange={(v) => setRole(v as "admin" | "member")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Üye</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
          <Button onClick={handleCreate} disabled={submitting}>
            {submitting ? "Oluşturuluyor..." : "Oluştur"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TeamSection() {
  const { isAdmin, profile: currentProfile } = useAuth();
  const { tasks } = useTasks();
  const { data: teams } = useTeams();
  const queryClient = useQueryClient();
  const [showCreateUser, setShowCreateUser] = useState(false);
  const { data: dailyReportRequests } = useDailyReportRequests();
  const { toggleRequest } = useDailyReportActions();

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

  const getDailyReportStatus = (userId: string) => {
    const req = dailyReportRequests?.find((r) => r.user_id === userId);
    return { isActive: req?.is_active ?? false, existingId: req?.id };
  };

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
        {isAdmin && (
          <Button size="sm" className="gap-1" onClick={() => setShowCreateUser(true)}>
            <UserPlus size={16} /> Kullanıcı Ekle
          </Button>
        )}
      </div>

      {isAdmin && <TeamManagementSection />}

      {isAdmin && <CreateUserDialog open={showCreateUser} onOpenChange={setShowCreateUser} />}

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
                {isAdmin && (() => {
                  const drs = getDailyReportStatus(member.user_id);
                  return (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Bell size={12} className="text-muted-foreground" />
                        <span className="text-muted-foreground">Günlük Bildirim</span>
                      </div>
                      <Switch
                        checked={drs.isActive}
                        onCheckedChange={() =>
                          toggleRequest.mutate({
                            userId: member.user_id,
                            requestedBy: currentProfile?.user_id ?? "",
                            currentlyActive: drs.isActive,
                            existingId: drs.existingId,
                          })
                        }
                      />
                    </div>
                  );
                })()}
                {!isAdmin && (() => {
                  const drs = getDailyReportStatus(member.user_id);
                  if (member.user_id === currentProfile?.user_id && drs.isActive) {
                    return (
                      <div className="flex items-center gap-1.5 text-xs text-amber-600">
                        <Bell size={12} />
                        <span>Admin sizden günlük bildirim bekliyor</span>
                      </div>
                    );
                  }
                  return null;
                })()}
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
