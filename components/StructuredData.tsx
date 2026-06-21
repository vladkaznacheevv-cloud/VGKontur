import {
  PHONE_DISPLAY,
  PHONE_TEL,
  PROJECT_NAME,
  SITE_URL,
  TELEGRAM_URL,
  WHATSAPP_URL
} from "@/lib/contacts";
import { SERVICE_AREA_CITIES } from "@/lib/serviceArea";

// Микроразметка schema.org для главной страницы. Только реальные данные:
// без рейтингов/отзывов, без точных цен и без точного адреса объекта.
const businessId = `${SITE_URL}/#business`;
const websiteId = `${SITE_URL}/#website`;

const businessDescription =
  "Ремонт и отделочные работы под ключ в Ессентуках и по КМВ: ремонт квартир, " +
  "ванные и санузлы, плиточные и электромонтажные работы, строительство домов. " +
  "Бесплатный выезд на замер, понятная смета до начала работ и контроль качества на каждом этапе.";

const services = [
  "Ремонт квартир под ключ",
  "Отделочные работы",
  "Ремонт ванной и санузла, плиточные работы",
  "Электромонтажные работы",
  "Строительство домов под ключ"
];

const areaServed = [
  ...SERVICE_AREA_CITIES.map((city) => ({ "@type": "City", name: city.name })),
  { "@type": "Place", name: "Кавказские Минеральные Воды (КМВ)" }
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["HomeAndConstructionBusiness", "GeneralContractor"],
      "@id": businessId,
      name: PROJECT_NAME,
      url: SITE_URL,
      description: businessDescription,
      telephone: PHONE_DISPLAY,
      image: `${SITE_URL}/icon.svg`,
      logo: `${SITE_URL}/icon.svg`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ессентуки",
        addressRegion: "Ставропольский край",
        addressCountry: "RU"
      },
      areaServed,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: PHONE_TEL,
        contactType: "customer service",
        areaServed: "RU",
        availableLanguage: "Russian"
      },
      sameAs: [WHATSAPP_URL, TELEGRAM_URL]
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: SITE_URL,
      name: PROJECT_NAME,
      inLanguage: "ru-RU",
      publisher: { "@id": businessId }
    },
    ...services.map((name) => ({
      "@type": "Service",
      name,
      serviceType: name,
      provider: { "@id": businessId },
      areaServed,
      inLanguage: "ru-RU"
    }))
  ]
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      // Статический безопасный контент; экранируем "<" на случай попадания в строки.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replace(/</g, "\\u003c")
      }}
    />
  );
}
