import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function SettingsSection() {
  const [projectName, setProjectName] = useState("ProTrack v2.0");
  const [notifications, setNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [language, setLanguage] = useState("tr");
  const [autoAssign, setAutoAssign] = useState(false);

  const handleSave = () => {
    toast.success("Ayarlar kaydedildi");
  };

  return (
    <div className="flex-1 overflow-auto px-4 md:px-6 py-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Ayarlar</h1>
        <p className="text-sm text-muted-foreground">Proje ve uygulama tercihlerinizi yönetin</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Genel Ayarlar</CardTitle>
            <CardDescription className="text-xs">Proje bilgileri ve temel yapılandırmalar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Proje Adı</Label>
              <Input value={projectName} onChange={e => setProjectName(e.target.value)} className="h-9 text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Dil</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tr">Türkçe</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Bildirimler</CardTitle>
            <CardDescription className="text-xs">Bildirim tercihlerinizi yapılandırın</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Anlık Bildirimler</Label>
                <p className="text-xs text-muted-foreground">Görev atandığında veya güncellendiğinde bildir</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">E-posta Özeti</Label>
                <p className="text-xs text-muted-foreground">Günlük görev özeti e-postası al</p>
              </div>
              <Switch checked={emailDigest} onCheckedChange={setEmailDigest} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">İş Akışı</CardTitle>
            <CardDescription className="text-xs">Otomasyon ve iş akışı kuralları</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Otomatik Atama</Label>
                <p className="text-xs text-muted-foreground">Yeni görevleri iş yüküne göre otomatik ata</p>
              </div>
              <Switch checked={autoAssign} onCheckedChange={setAutoAssign} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="sm">Kaydet</Button>
        </div>
      </div>
    </div>
  );
}
