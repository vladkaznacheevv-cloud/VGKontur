import type { Metadata, Viewport } from "next";
import { YandexMetrica } from "@/components/YandexMetrica";
import { PROJECT_NAME, SITE_URL } from "@/lib/contacts";
import "./globals.css";

const siteTitle = "Ремонт и отделочные работы в Ессентуках — VG Контур";
const siteDescription =
  "Ремонт квартир, отделка, ванные и санузлы под ключ в Ессентуках. Бесплатный выезд на замер, понятная смета до начала работ и контроль качества на каждом этапе. Работаем по КМВ: Кисловодск, Железноводск, Пятигорск.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: siteTitle,
  description: siteDescription,
  applicationName: PROJECT_NAME,
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" }
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: SITE_URL,
    type: "website",
    locale: "ru_RU",
    siteName: PROJECT_NAME
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4efe7"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        {children}
        <YandexMetrica />
      </body>
    </html>
  );
}
