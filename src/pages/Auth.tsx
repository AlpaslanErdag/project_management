import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { LogIn, UserPlus } from "lucide-react";

type Team = { id: string; name: string };

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.from("teams").select("id, name").then(({ data }) => {
      if (data) setTeams(data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) toast({ title: "Giriş hatası", description: error.message, variant: "destructive" });
      } else {
        if (!teamId) {
          toast({ title: "Takım seçin", description: "Lütfen bir takım seçin", variant: "destructive" });
          setSubmitting(false);
          return;
        }
        const { error } = await signUp(email, password, fullName, teamId);
        if (error) toast({ title: "Kayıt hatası", description: error.message, variant: "destructive" });
        else toast({ title: "Başarılı", description: "Hesabınız oluşturuldu. E-posta onayı gerekebilir." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-lg">P</span>
          </div>
          <h1 className="text-2xl font-bold">ProTrack</h1>
          <p className="text-muted-foreground text-sm mt-1">Proje takip ve yönetim sistemi</p>
        </div>

        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex gap-2 mb-6">
            <Button
              variant={isLogin ? "default" : "outline"}
              className="flex-1 gap-2"
              onClick={() => setIsLogin(true)}
            >
              <LogIn size={16} /> Giriş Yap
            </Button>
            <Button
              variant={!isLogin ? "default" : "outline"}
              className="flex-1 gap-2"
              onClick={() => setIsLogin(false)}
            >
              <UserPlus size={16} /> Kayıt Ol
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <Input
                  placeholder="Ad Soyad"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
                <Select value={teamId} onValueChange={setTeamId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Takım seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
            <Input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Yükleniyor..." : isLogin ? "Giriş Yap" : "Kayıt Ol"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
