import type { Metadata, Viewport } from "next";
import { YandexMetrica } from "@/components/YandexMetrica";
import "./globals.css";

const siteTitle = "Ремонт и отделочные работы в Ессентуках — VG Контур";
const siteDescription =
  "Ремонт квартир, отделка, ванные и санузлы под ключ в Ессентуках. Бесплатный выезд на замер, понятная смета до начала работ и контроль качества на каждом этапе. Работаем по КМВ: Кисловодск, Железноводск, Пятигорск.";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    locale: "ru_RU",
    siteName: "VG Контур"
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
