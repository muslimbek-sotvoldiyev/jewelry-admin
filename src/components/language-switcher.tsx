"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/src/i18n/routing";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const languages = [
  { code: "uz", name: "O'zbekcha", flag: "🇺🇿" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const currentLanguage = languages.find((lang) => lang.code === locale);

const handleLanguageChange = (newLocale: string) => {
  const cleanPath = pathname.replace(/^\/(uz|en|tr)(?=\/|$)/, "");
  const targetPath = cleanPath === "" ? "/" : cleanPath;

  router.push(targetPath, { locale: newLocale });
};


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          {currentLanguage?.flag}
          <span>{currentLanguage?.name}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={
              locale === language.code
                ? "bg-accent text-accent-foreground font-semibold"
                : ""
            }
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
