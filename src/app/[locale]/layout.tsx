import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import StoreProvider from "@/src/lib/providers";
import { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/src/i18n/routing";
import { notFound } from "next/navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zargarlik Admin Panel",
  description: "Zargarlik korxonalari uchun boshqaruv tizimi",
  generator: "fullstackchi",
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // ✅ params ni await qilib olish
  const { locale } = await props.params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // ✅ getMessages ga locale berish
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Suspense fallback={<div>Loading...</div>}>
            <StoreProvider>{props.children}</StoreProvider>
          </Suspense>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
