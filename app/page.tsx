import {
  ArrowRight,
  Bath,
  Building2,
  Calculator,
  Check,
  ClipboardCheck,
  Hammer,
  Handshake,
  Home,
  KeyRound,
  Layers,
  MessageCircle,
  MessageSquareText,
  Paintbrush,
  Phone,
  PhoneCall,
  Ruler,
  SearchCheck,
  Send,
  ShieldCheck,
  Wrench,
  Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import calculatorImage from "@/assets/optimized/calculator-estimate-v01.webp";
import heroImage from "@/assets/optimized/hero-renovation-essentuki-v01.webp";
import processQualityImage from "@/assets/optimized/process-quality-control-v01.webp";
import serviceApartmentImage from "@/assets/optimized/service-apartment-renovation-v01.webp";
import serviceBathroomImage from "@/assets/optimized/service-bathroom-tile-v01.webp";
import serviceElectricalImage from "@/assets/optimized/service-electrical-panel-v01.webp";
import serviceFinishingImage from "@/assets/optimized/service-finishing-v01.webp";
import serviceHouseImage from "@/assets/optimized/service-house-construction-v01.webp";
import serviceMasonryImage from "@/assets/optimized/service-masonry-v01.webp";
import serviceRoofingImage from "@/assets/optimized/service-roofing-v01.webp";
import { BrandLogo } from "@/components/BrandLogo";
import { LeadForm } from "@/components/LeadForm";
import { StructuredData } from "@/components/StructuredData";
import { TrackedLink } from "@/components/TrackedLink";
import { WorksGallery } from "@/components/WorksGallery";
import { YandexServiceMap } from "@/components/YandexServiceMap";
import { METRICA_GOALS } from "@/lib/metricaGoals";
import {
  PHONE_DISPLAY,
  PHONE_TEL,
  PROJECT_DESCRIPTOR,
  PROJECT_HEADER_NAME,
  PROJECT_NAME,
  PROJECT_SLOGAN,
  TELEGRAM_URL,
  WHATSAPP_URL
} from "@/lib/contacts";

const services = [
  {
    title: "Отделочные работы",
    text: "Выравнивание стен и потолков, покраска, обои, напольные покрытия — аккуратная чистовая отделка квартир и домов.",
    Icon: Paintbrush,
    image: serviceFinishingImage,
    imageAlt: "Аккуратная отделка комнаты с чистыми инструментами и материалами",
    featured: true
  },
  {
    title: "Ремонт квартир",
    text: "Ремонт «под ключ»: от черновых работ до финишной отделки и уборки перед заселением.",
    Icon: Home,
    image: serviceApartmentImage,
    imageAlt: "Светлая квартира после ремонта с аккуратно сложенными материалами",
    featured: true
  },
  {
    title: "Ванная, санузел, плитка",
    text: "Плитка, гидроизоляция, разводка сантехники и ровные швы — санузел, который прослужит годы.",
    Icon: Bath,
    image: serviceBathroomImage,
    imageAlt: "Чистая укладка плитки в ванной с уровнем и подготовленными материалами",
    featured: true
  },
  {
    title: "Электрика",
    text: "Разводка и замена проводки, щиты, розетки и подготовка электрики под ремонт.",
    Icon: Zap,
    image: serviceElectricalImage,
    imageAlt: "Аккуратный электрический щит в светлом помещении"
  },
  {
    title: "Строительство домов",
    text: "Частные дома «под ключ»: от фундамента до кровли и фасада.",
    Icon: Building2,
    image: serviceHouseImage,
    imageAlt: "Чистый этап строительства частного дома из блоков"
  },
  {
    title: "Кровля",
    text: "Монтаж и ремонт кровли: стропильная система, утепление и кровельное покрытие.",
    Icon: Layers,
    image: serviceRoofingImage,
    imageAlt: "Аккуратная кровля частного дома на этапе монтажа"
  },
  {
    title: "Кладка",
    text: "Кладка стен и перегородок из кирпича, газобетона и блоков под ваш проект.",
    Icon: Hammer,
    image: serviceMasonryImage,
    imageAlt: "Ровная блочная кладка с уровнем на чистом объекте"
  }
];

const trustItems = [
  {
    title: "Инженеры и мастера 10–15 лет",
    text: "Объект ведут инженеры-строители и проверенные мастера — не случайная бригада, которая исчезнет на полпути.",
    Icon: Wrench
  },
  {
    title: "Смета понятна до старта",
    text: "Считаем смету после замера и согласуем её до начала работ — без скрытых доплат «по ходу».",
    Icon: ClipboardCheck
  },
  {
    title: "Контроль на каждом этапе",
    text: "Инженер принимает работы поэтапно — меньше переделок, и вы всегда видите, за что платите.",
    Icon: ShieldCheck
  },
  {
    title: "Сроки и порядок на объекте",
    text: "Работаем по этапам, держим связь с ответственным и поддерживаем порядок на площадке.",
    Icon: Ruler
  }
];

const processSteps = [
  {
    title: "Заявка",
    text: "Звонок, WhatsApp, Telegram или форма на сайте",
    Icon: MessageSquareText
  },
  {
    title: "Консультация",
    text: "Уточняем задачу, объект и удобное время",
    Icon: PhoneCall
  },
  {
    title: "Выезд",
    text: "Бесплатный замер в Ессентуках и по КМВ",
    Icon: Ruler
  },
  {
    title: "Смета",
    text: "Понятный расчёт до начала работ",
    Icon: Calculator
  },
  {
    title: "Согласование",
    text: "Фиксируем состав работ и материалы",
    Icon: Handshake
  },
  {
    title: "Выполнение",
    text: "Работы по согласованным этапам",
    Icon: Hammer
  },
  {
    title: "Контроль",
    text: "Проверяем качество на каждом этапе",
    Icon: SearchCheck
  },
  {
    title: "Сдача",
    text: "Принимаете готовый объект без хаоса",
    Icon: KeyRound
  }
];

const yandexMapsApiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

export default function HomePage() {
  return (
    <main>
      <StructuredData />
      <header className="site-header">
        <a className="brand" href="#top" aria-label={`${PROJECT_NAME}, перейти к началу`}>
          <span className="brand-mark" aria-hidden="true">
            <BrandLogo className="brand-logo" />
          </span>
          <span>
            <strong>{PROJECT_HEADER_NAME}</strong>
            <small>{PROJECT_DESCRIPTOR}</small>
          </span>
        </a>

        <nav className="site-nav" aria-label="Основная навигация">
          <a href="#services">Услуги</a>
          <a href="#trust">Доверие</a>
          <a href="#process">Этапы</a>
          <a href="#calculator">Оценка</a>
          <a href="#works">Работы</a>
          <a href="#contacts">Контакты</a>
        </nav>

        <div className="header-actions">
          <TrackedLink className="phone-link" href={`tel:${PHONE_TEL}`} goal={METRICA_GOALS.phoneClick}>
            <Phone size={17} aria-hidden="true" />
            <span>{PHONE_DISPLAY}</span>
          </TrackedLink>
          <TrackedLink
            className="button button-compact button-primary"
            href={WHATSAPP_URL}
            goal={METRICA_GOALS.whatsappClick}
          >
            <MessageCircle size={17} aria-hidden="true" />
            <span>WhatsApp</span>
          </TrackedLink>
          <TrackedLink
            className="button button-compact button-secondary"
            href={TELEGRAM_URL}
            goal={METRICA_GOALS.telegramClick}
          >
            <Send size={17} aria-hidden="true" />
            <span>Telegram</span>
          </TrackedLink>
        </div>
      </header>

      <section className="hero section-shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            {PROJECT_NAME}: {PROJECT_DESCRIPTOR}
          </p>
          <h1>Ремонт и отделочные работы в&nbsp;Ессентуках</h1>
          <p className="hero-lead">
            Ремонт и отделка «под ключ» в Ессентуках и по всему КМВ. Ведём объект под контролем
            инженера — спокойно и предсказуемо.
            <span className="dt-only">
              {" "}
              Бесплатный замер, понятная смета до старта и приёмка каждого этапа — без срыва
              сроков и доплат «по ходу».
            </span>
          </p>

          <ul className="hero-bullets" aria-label="Ключевые условия">
            <li>
              <Check size={18} aria-hidden="true" />
              Бесплатный выезд на замер
            </li>
            <li>
              <Check size={18} aria-hidden="true" />
              Понятная смета до начала работ
            </li>
            <li>
              <Check size={18} aria-hidden="true" />
              Инженеры-строители и мастера с опытом 10–15 лет
            </li>
            <li>
              <Check size={18} aria-hidden="true" />
              Контроль качества на каждом этапе
            </li>
          </ul>

          <div className="hero-actions">
            <a className="button button-primary" href="#lead-form">
              <span>Вызвать замерщика</span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="button button-secondary" href="#calculator">
              <Calculator size={18} aria-hidden="true" />
              <span>Рассчитать стоимость ремонта</span>
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <Image
            src={heroImage}
            alt="Светлый интерьер квартиры после аккуратного ремонта и отделки"
            width={heroImage.width}
            height={heroImage.height}
            priority
            sizes="(min-width: 980px) 48vw, 100vw"
          />
        </div>
      </section>

      <section className="services section-shell" id="services">
        <div className="section-heading">
          <p className="eyebrow">Что мы делаем</p>
          <h2>Услуги по ремонту и отделке в Ессентуках</h2>
          <p>
            Основной профиль — отделка, ремонт квартир, ванные и санузлы «под ключ».
            <span className="dt-only"> Также строим дома, делаем электрику, кровлю и кладку по всему КМВ.</span>
          </p>
        </div>

        <div className="services-grid">
          {services.map(({ title, text, Icon, image, imageAlt, featured }) => (
            <article className={featured ? "service-card service-card-featured" : "service-card"} key={title}>
              <div className="service-image">
                <Image
                  src={image}
                  alt={imageAlt}
                  width={image.width}
                  height={image.height}
                  sizes="(min-width: 980px) 31vw, (min-width: 700px) 48vw, 100vw"
                />
              </div>
              <div className="service-card-top">
                <span className="service-icon" aria-hidden="true">
                  <Icon size={24} />
                </span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="trust section-shell" id="trust">
        <div className="section-heading compact">
          <p className="eyebrow">Почему нам доверяют</p>
          <h2>Снимаем главные страхи ремонта</h2>
          <p>
            Срыв сроков, скрытые доплаты, пропавшие мастера и переделки — знаем эти страхи и
            работаем так, чтобы их не было.
            <span className="dt-only"> Без выдуманных наград и обещаний точной цены до осмотра объекта.</span>
          </p>
        </div>
        <div className="trust-grid">
          <div className="trust-image">
            <Image
              src={processQualityImage}
              alt="Проверка качества отделочных работ на объекте"
              width={processQualityImage.width}
              height={processQualityImage.height}
              sizes="(min-width: 980px) 38vw, 100vw"
            />
          </div>
          <div className="trust-items">
            {trustItems.map(({ title, text, Icon }) => (
              <article className="trust-item" key={title}>
                <Icon size={26} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="process section-shell" id="process">
        <div className="section-heading">
          <p className="eyebrow">Как мы работаем</p>
          <h2>Восемь шагов от заявки до сдачи объекта</h2>
          <p>
            Заявка сразу попадает к команде — перезваниваем и согласуем выезд.
            <span className="dt-only"> Дальше ведём объект по понятным этапам — без потерянных звонков и «забытых» смет.</span>
          </p>
        </div>

        <ol className="process-list">
          {processSteps.map(({ title, text, Icon }, index) => (
            <li className="process-step" key={title}>
              <span className="process-step-icon" aria-hidden="true">
                <Icon size={26} strokeWidth={1.8} />
              </span>
              <span className="process-step-num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong>{title}</strong>
              <span className="process-step-text">{text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="calculator section-shell" id="calculator">
        <div className="calculator-copy">
          <p className="eyebrow">Предварительная оценка</p>
          <h2>Узнайте предварительную стоимость ремонта</h2>
          <p>
            Прикиньте бюджет по площади и типу работ за минуту.
            <span className="dt-only"> Это предварительный расчёт, а не точная цена — итоговую смету составим после замера.</span>
          </p>
          <div className="estimate-note">
            <ClipboardCheck size={22} aria-hidden="true" />
            <span>
              Стоимость предварительная. Точная смета составляется после замера и зависит
              от состояния объекта, материалов и объёма работ.
            </span>
          </div>
          <div className="calculator-image" aria-hidden="true">
            <Image
              src={calculatorImage}
              alt=""
              width={calculatorImage.width}
              height={calculatorImage.height}
              sizes="(min-width: 980px) 40vw, 100vw"
            />
          </div>
        </div>
        <LeadForm variant="calculator" />
      </section>

      <section className="works section-shell" id="works">
        <div className="section-heading">
          <p className="eyebrow">Наши работы</p>
          <h2>Фотографии с реальных объектов</h2>
          <p>
            Реальные фото с объектов нашей команды. Выберите направление и посмотрите крупнее.
            <span className="dt-only"> Внутренняя отделка, строительство домов, фасадные, ландшафтные и промышленные работы.</span>
          </p>
        </div>

        <WorksGallery />

        <div className="works-cta">
          <a className="button button-primary" href="#lead-form">
            <span>Обсудить похожую задачу</span>
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="lead-section section-shell" id="lead-form">
        <div className="lead-panel-copy">
          <p className="eyebrow">Заявка на замер</p>
          <h2>Получите бесплатный замер и понятную смету</h2>
          <p>
            Оставьте контакты — перезвоним и согласуем удобное время для замера.
            <span className="dt-only"> Уточним город, объект и тип работ. Итоговую смету подготовим после осмотра.</span>
          </p>
        </div>
        <LeadForm variant="lead" />
      </section>

      <section className="contacts section-shell" id="contacts">
        <div className="contacts-card">
          <div>
            <p className="eyebrow">Контакты</p>
            <h2>Свяжитесь удобным способом</h2>
            <p>
              {PROJECT_NAME} базируется в Ессентуках и работает по всему КМВ.
              <span className="dt-only">
                {" "}
                Кисловодск, Железноводск, Пятигорск и соседние населённые пункты — по согласованию.
              </span>
            </p>
          </div>

          <div className="contact-links">
            <TrackedLink href={`tel:${PHONE_TEL}`} goal={METRICA_GOALS.phoneClick}>
              <Phone size={19} aria-hidden="true" />
              <span>{PHONE_DISPLAY}</span>
            </TrackedLink>
            <TrackedLink href={WHATSAPP_URL} goal={METRICA_GOALS.whatsappClick}>
              <MessageCircle size={19} aria-hidden="true" />
              <span>Написать в WhatsApp</span>
            </TrackedLink>
            <TrackedLink href={TELEGRAM_URL} goal={METRICA_GOALS.telegramClick}>
              <Send size={19} aria-hidden="true" />
              <span>Написать в Telegram</span>
            </TrackedLink>
          </div>
        </div>

        <div className="service-area" aria-label="Зона работы">
          <YandexServiceMap apiKey={yandexMapsApiKey} />
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="footer-brand-mark" aria-hidden="true">
            <BrandLogo className="brand-logo" />
          </span>
          <span className="footer-brand-text">
            <strong>{PROJECT_NAME}</strong>
            <span>{PROJECT_DESCRIPTOR}</span>
          </span>
        </div>
        <p>Заявка не является публичной офертой или финальной сметой.</p>
        <Link href="/privacy">Политика обработки персональных данных</Link>
      </footer>

      <nav className="mobile-cta-bar" aria-label="Быстрая связь">
        <TrackedLink className="mobile-cta mobile-cta-call" href={`tel:${PHONE_TEL}`} goal={METRICA_GOALS.phoneClick}>
          <Phone size={18} aria-hidden="true" />
          <span>Позвонить</span>
        </TrackedLink>
        <TrackedLink className="mobile-cta mobile-cta-wa" href={WHATSAPP_URL} goal={METRICA_GOALS.whatsappClick}>
          <MessageCircle size={18} aria-hidden="true" />
          <span>WhatsApp</span>
        </TrackedLink>
        <a className="mobile-cta mobile-cta-measure" href="#lead-form">
          <Ruler size={18} aria-hidden="true" />
          <span>Замер</span>
        </a>
      </nav>
    </main>
  );
}
