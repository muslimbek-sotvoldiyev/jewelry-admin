import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import StoreProvider from "@/lib/providers"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Zargarlik Admin Panel",
  description: "Zargarlik korxonalari uchun boshqaruv tizimi",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <StoreProvider>{children}</StoreProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}