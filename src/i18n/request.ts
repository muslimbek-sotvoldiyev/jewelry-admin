import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// routing ichidagi tiplashni ishlatamiz
type Locale = (typeof routing.locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = (await requestLocale) as Locale | undefined;

  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale as Locale;
  }

  // JSON faylni dinamik import qilish
  const mod = await import(`../../message/${locale}.json`);

  return {
    locale,
    messages: mod.default as Record<string, string>,
  };
});
