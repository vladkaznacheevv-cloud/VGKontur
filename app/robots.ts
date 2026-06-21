import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/contacts";

// Разрешаем индексацию публичных страниц, закрываем только серверные API-маршруты
// (приём заявок). Sitemap и host указываем абсолютным URL продакшена.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/"
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}
