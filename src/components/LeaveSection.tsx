import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLeavePeriods, useLeaveRequests, useLeaveActions, type LeavePeriod } from "@/hooks/useLeave";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { CalendarDays, Plus, Trash2, Check, X, Clock } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

function AdminPeriodManager() {
  const { profile } = useAuth();
  const { data: periods } = useLeavePeriods();
  const { createPeriod, deletePeriod, togglePeriod } = useLeaveActions();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleCreate = async () => {
    if (!name.trim() || !startDate || !endDate || !profile) {
      toast({ title: "Uyarı", description: "Tüm alanları doldurun.", variant: "destructive" });
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      toast({ title: "Uyarı", description: "Bitiş tarihi başlangıçtan sonra olmalı.", variant: "destructive" });
      return;
    }
    try {
      await createPeriod.mutateAsync({ name: name.trim(), start_date: startDate, end_date: endDate, created_by: profile.user_id });
      toast({ title: "Başarılı", description: "İzin dönemi oluşturuldu." });
      setName(""); setStartDate(""); setEndDate("");
    } catch {
      toast({ title: "Hata", description: "İzin dönemi oluşturulamadı.", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2"><CalendarDays size={16} /> İzin Dönemleri Yönetimi</CardTitle>
        <CardDescription className="text-xs">Çalışanların izin talep edebileceği dönemleri belirleyin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <Input placeholder="Dönem adı (ör: 2026 Q1)" value={name} onChange={(e) => setName(e.target.value)} className="h-9 text-sm" />
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-9 text-sm" />
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-9 text-sm" />
          <Button size="sm" className="h-9 gap-1" onClick={handleCreate} disabled={createPeriod.isPending}>
            <Plus size={14} /> Dönem Ekle
          </Button>
        </div>

        <div className="space-y-2">
          {periods?.map((period) => (
            <div key={period.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{period.name}</span>
                  <Badge variant={period.is_active ? "default" : "secondary"} className="text-[10px]">
                    {period.is_active ? "Aktif" : "Pasif"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {format(new Date(period.start_date), "d MMM yyyy", { locale: tr })} — {format(new Date(period.end_date), "d MMM yyyy", { locale: tr })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Label className="text-xs">Aktif</Label>
                  <Switch checked={period.is_active} onCheckedChange={(v) => togglePeriod.mutate({ id: period.id, is_active: v })} />
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 size={14} /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Dönemi Sil</AlertDialogTitle>
                      <AlertDialogDescription>"{period.name}" dönemini ve bağlı tüm izin taleplerini silmek istediğinizden emin misiniz?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>İptal</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deletePeriod.mutate(period.id)} className="bg-destructive text-destructive-foreground">Sil</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
          {(!periods || periods.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">Henüz izin dönemi tanımlanmamış.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function LeaveRequestForm() {
  const { profile } = useAuth();
  const { data: periods } = useLeavePeriods();
  const { createLeaveRequest } = useLeaveActions();
  const [periodId, setPeriodId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [note, setNote] = useState("");

  const activePeriods = periods?.filter((p) => p.is_active) ?? [];
  const selectedPeriod = activePeriods.find((p) => p.id === periodId);

  const handleSubmit = async () => {
    if (!periodId || !startDate || !endDate || !profile) {
      toast({ title: "Uyarı", description: "Dönem ve tarihler gerekli.", variant: "destructive" });
      return;
    }
    if (selectedPeriod) {
      if (new Date(startDate) < new Date(selectedPeriod.start_date) || new Date(endDate) > new Date(selectedPeriod.end_date)) {
        toast({ title: "Uyarı", description: `Tarihler dönem aralığında olmalı: ${format(new Date(selectedPeriod.start_date), "d MMM", { locale: tr })} - ${format(new Date(selectedPeriod.end_date), "d MMM", { locale: tr })}`, variant: "destructive" });
        return;
      }
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast({ title: "Uyarı", description: "Bitiş tarihi başlangıçtan sonra olmalı.", variant: "destructive" });
      return;
    }
    try {
      await createLeaveRequest.mutateAsync({
        user_id: profile.user_id,
        leave_period_id: periodId,
        start_date: startDate,
        end_date: endDate,
        note: note.trim() || undefined,
      });
      toast({ title: "Başarılı", description: "İzin talebiniz kaydedildi." });
      setPeriodId(""); setStartDate(""); setEndDate(""); setNote("");
    } catch {
      toast({ title: "Hata", description: "İzin talebi gönderilemedi.", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2"><CalendarDays size={16} /> İzin Talebi Oluştur</CardTitle>
        <CardDescription className="text-xs">Planlanan izin tarihlerinizi belirleyin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {activePeriods.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Şu an aktif izin dönemi bulunmuyor.</p>
        ) : (
          <>
            <Select value={periodId} onValueChange={(v) => { setPeriodId(v); setStartDate(""); setEndDate(""); }}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="İzin dönemi seçin" /></SelectTrigger>
              <SelectContent>
                {activePeriods.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({format(new Date(p.start_date), "d MMM", { locale: tr })} - {format(new Date(p.end_date), "d MMM", { locale: tr })})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPeriod && (
              <p className="text-xs text-muted-foreground">
                Tarihler <strong>{format(new Date(selectedPeriod.start_date), "d MMMM yyyy", { locale: tr })}</strong> ile <strong>{format(new Date(selectedPeriod.end_date), "d MMMM yyyy", { locale: tr })}</strong> arasında olmalıdır.
              </p>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Başlangıç</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  min={selectedPeriod?.start_date} max={selectedPeriod?.end_date} className="h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Bitiş</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || selectedPeriod?.start_date} max={selectedPeriod?.end_date} className="h-9 text-sm" />
              </div>
            </div>
            <Textarea placeholder="Not (isteğe bağlı)" value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="text-sm" />
            <Button size="sm" className="gap-1" onClick={handleSubmit} disabled={createLeaveRequest.isPending}>
              <Plus size={14} /> Talep Oluştur
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function LeaveRequestsList() {
  const { isAdmin, profile } = useAuth();
  const { data: requests } = useLeaveRequests();
  const { data: periods } = useLeavePeriods();
  const { updateLeaveStatus, deleteLeaveRequest } = useLeaveActions();

  const { data: profiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const getPeriodName = (id: string) => periods?.find((p) => p.id === id)?.name ?? "—";
  const getUserName = (userId: string) => profiles?.find((p) => p.user_id === userId)?.full_name ?? "—";

  const displayRequests = isAdmin ? requests : requests?.filter((r) => r.user_id === profile?.user_id);

  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    pending: { label: "Beklemede", variant: "outline" },
    approved: { label: "Onaylandı", variant: "default" },
    rejected: { label: "Reddedildi", variant: "destructive" },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2"><Clock size={16} /> İzin Talepleri</CardTitle>
        <CardDescription className="text-xs">{isAdmin ? "Tüm çalışanların izin talepleri" : "Sizin izin talepleriniz"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {displayRequests?.map((req) => {
            const sc = statusConfig[req.status] ?? statusConfig.pending;
            return (
              <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {isAdmin && <span className="text-sm font-medium">{getUserName(req.user_id)}</span>}
                    <Badge variant="outline" className="text-[10px]">{getPeriodName(req.leave_period_id)}</Badge>
                    <Badge variant={sc.variant} className="text-[10px]">{sc.label}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {format(new Date(req.start_date), "d MMM yyyy", { locale: tr })} — {format(new Date(req.end_date), "d MMM yyyy", { locale: tr })}
                    {req.note && <span className="ml-2 italic">"{req.note}"</span>}
                  </p>
                </div>
                <div className="flex gap-1">
                  {isAdmin && req.status === "pending" && (
                    <>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600" title="Onayla"
                        onClick={() => updateLeaveStatus.mutate({ id: req.id, status: "approved" })}>
                        <Check size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" title="Reddet"
                        onClick={() => updateLeaveStatus.mutate({ id: req.id, status: "rejected" })}>
                        <X size={14} />
                      </Button>
                    </>
                  )}
                  {(isAdmin || (req.status === "pending" && req.user_id === profile?.user_id)) && (
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" title="Sil"
                      onClick={() => deleteLeaveRequest.mutate(req.id)}>
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
          {(!displayRequests || displayRequests.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">Henüz izin talebi yok.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function LeaveSection() {
  const { isAdmin } = useAuth();

  return (
    <div className="flex-1 overflow-auto px-4 md:px-6 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Yıllık İzin Yönetimi</h1>
        <p className="text-sm text-muted-foreground">İzin dönemlerini ve taleplerini yönetin</p>
      </div>
      <div className="space-y-6">
        {isAdmin && <AdminPeriodManager />}
        <LeaveRequestForm />
        <LeaveRequestsList />
      </div>
    </div>
  );
}
