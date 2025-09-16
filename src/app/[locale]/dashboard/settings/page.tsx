"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
import { Badge } from "@/src/components/ui/badge";
import { Moon, Sun, Monitor, Bell, Shield, Globe, Save } from "lucide-react";
import { toast } from "@/src/hooks/use-toast";

export default function SettingsPage() {
  const t = useTranslations("settings");

  const [theme, setTheme] = useState("system");
  const [notifications, setNotifications] = useState({
    transfers: true,
    workshops: true,
    system: false,
    email: true,
  });
  const [language, setLanguage] = useState("uz");
  const [autoLogout, setAutoLogout] = useState("30");

  const handleSaveSettings = () => {
    toast({
      title: t("title"),
      description: t("success"),
    });
  };

  const themeOptions = [
    { value: "light", label: t("appearance.themes.light"), icon: Sun },
    { value: "dark", label: t("appearance.themes.dark"), icon: Moon },
    { value: "system", label: t("appearance.themes.system"), icon: Monitor },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              {t("appearance.title")}
            </CardTitle>
            <CardDescription>{t("appearance.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>{t("appearance.theme")}</Label>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.value}
                      variant={theme === option.value ? "default" : "outline"}
                      className="flex flex-col gap-2 h-auto p-4"
                      onClick={() => setTheme(option.value)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm">{option.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>{t("appearance.language")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("appearance.languageDescription")}
                </p>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uz">O'zbekcha</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {t("notifications.title")}
            </CardTitle>
            <CardDescription>{t("notifications.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t("notifications.transfer")}</Label>
                  <p className="text-sm text-muted-foreground">
                    Yangi transferlar haqida xabar olish
                  </p>
                </div>
                <Switch
                  checked={notifications.transfers}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, transfers: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t("notifications.workshop")}</Label>
                  <p className="text-sm text-muted-foreground">
                    Atolye holati o'zgarishi haqida
                  </p>
                </div>
                <Switch
                  checked={notifications.workshops}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, workshops: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t("notifications.system")}</Label>
                  <p className="text-sm text-muted-foreground">
                    Tizim yangilanishlari va xatoliklar
                  </p>
                </div>
                <Switch
                  checked={notifications.system}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, system: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t("notifications.email")}</Label>
                  <p className="text-sm text-muted-foreground">
                    Muhim xabarlarni emailga yuborish
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t("security.title")}
            </CardTitle>
            <CardDescription>{t("security.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>{t("security.autoLogout")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("security.autoLogoutDesc")}
                </p>
              </div>
              <Select value={autoLogout} onValueChange={setAutoLogout}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 daqiqa</SelectItem>
                  <SelectItem value="30">30 daqiqa</SelectItem>
                  <SelectItem value="60">1 soat</SelectItem>
                  <SelectItem value="120">2 soat</SelectItem>
                  <SelectItem value="0">O‘chirish</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>{t("security.password")}</Label>
              <div className="grid gap-3">
                <Input type="password" placeholder={t("security.current")} />
                <Input type="password" placeholder={t("security.new")} />
                <Input type="password" placeholder={t("security.confirm")} />
                <Button variant="outline" className="w-fit bg-transparent">
                  {t("security.updateBtn")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t("systemInfo.title")}
            </CardTitle>
            <CardDescription>{t("systemInfo.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium">{t("systemInfo.version")}</Label>
                <Badge variant="secondary">v1.0.0</Badge>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">{t("systemInfo.lastUpdate")}</Label>
                <p className="text-sm text-muted-foreground">2024-01-20</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">{t("systemInfo.users")}</Label>
                <p className="text-sm text-muted-foreground">12 ta</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">{t("systemInfo.workshops")}</Label>
                <p className="text-sm text-muted-foreground">8 ta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {t("saveBtn")}
          </Button>
        </div>
      </div>
    </div>
  );
}
