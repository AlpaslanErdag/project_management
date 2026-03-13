import { useState } from "react";
import { useTeams } from "@/hooks/useTeams";
import { useReminders } from "@/hooks/useReminders";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReminderDialog({ open, onOpenChange }: ReminderDialogProps) {
  const { data: teams } = useTeams();
  const { sendReminder } = useReminders();
  const [targetType, setTargetType] = useState<"team" | "user">("team");
  const [targetId, setTargetId] = useState("");
  const [message, setMessage] = useState("");

  const { data: profiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const handleSend = async () => {
    if (!targetId || !message.trim()) {
      toast({ title: "Uyarı", description: "Hedef ve mesaj alanlarını doldurun.", variant: "destructive" });
      return;
    }
    try {
      await sendReminder.mutateAsync({ target_type: targetType, target_id: targetId, message: message.trim() });
      toast({ title: "Başarılı", description: "Hatırlatma gönderildi." });
      setMessage("");
      setTargetId("");
      onOpenChange(false);
    } catch {
      toast({ title: "Hata", description: "Hatırlatma gönderilemedi.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hatırlatma Gönder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={targetType === "team" ? "default" : "outline"}
              size="sm"
              onClick={() => { setTargetType("team"); setTargetId(""); }}
            >
              Takıma
            </Button>
            <Button
              variant={targetType === "user" ? "default" : "outline"}
              size="sm"
              onClick={() => { setTargetType("user"); setTargetId(""); }}
            >
              Kişiye
            </Button>
          </div>

          <Select value={targetId} onValueChange={setTargetId}>
            <SelectTrigger>
              <SelectValue placeholder={targetType === "team" ? "Takım seçin" : "Kişi seçin"} />
            </SelectTrigger>
            <SelectContent>
              {targetType === "team"
                ? teams?.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))
                : profiles?.map((p) => (
                    <SelectItem key={p.user_id} value={p.user_id}>{p.full_name}</SelectItem>
                  ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Hatırlatma mesajı yazın..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />

          <Button onClick={handleSend} disabled={sendReminder.isPending} className="w-full gap-2">
            <Send size={14} />
            {sendReminder.isPending ? "Gönderiliyor..." : "Gönder"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
