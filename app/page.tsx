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
    text: "Чистовая отделка квартир и домов в Ессентуках: выравнивание, покраска, покрытия и аккуратная сдача каждого этапа.",
    Icon: Paintbrush,
    image: serviceFinishingImage,
    imageAlt: "Аккуратная отделка комнаты с чистыми инструментами и материалами",
    featured: true
  },
  {
    title: "Ремонт квартир",
    text: "Ремонт под ключ: бесплатный замер, понятная смета, подбор мастеров и контроль работ до сдачи.",
    Icon: Home,
    image: serviceApartmentImage,
    imageAlt: "Светлая квартира после ремонта с аккуратно сложенными материалами",
    featured: true
  },
  {
    title: "Ванная, санузел, плитка",
    text: "Укладка плитки, подготовка основания, сантехнические узлы и чистая геометрия швов.",
    Icon: Bath,
    image: serviceBathroomImage,
    imageAlt: "Чистая укладка плитки в ванной с уровнем и подготовленными материалами",
    featured: true
  },
  {
    title: "Электрика",
    text: "Разводка, замена точек, подготовка под ремонт и согласование объёма прямо на объекте.",
    Icon: Zap,
    image: serviceElectricalImage,
    imageAlt: "Аккуратный электрический щит в светлом помещении"
  },
  {
    title: "Строительство домов",
    text: "Выезд на участок, обсуждение задачи, предварительная оценка и подбор бригады под объём.",
    Icon: Building2,
    image: serviceHouseImage,
    imageAlt: "Чистый этап строительства частного дома из блоков"
  },
  {
    title: "Кровля",
    text: "Осмотр, расчёт после замера и выполнение работ по согласованному поэтапному плану.",
    Icon: Layers,
    image: serviceRoofingImage,
    imageAlt: "Аккуратная кровля частного дома на этапе монтажа"
  },
  {
    title: "Кладка",
    text: "Каменная и блочная кладка после оценки условий, материалов и требований к объекту.",
    Icon: Hammer,
    image: serviceMasonryImage,
    imageAlt: "Ровная блочная кладка с уровнем на чистом объекте"
  }
];

const trustItems = [
  {
    title: "Специалисты 10+ лет",
    text: "Подбираем мастеров под конкретный тип работ — без обещаний точной цены до осмотра объекта.",
    Icon: Wrench
  },
  {
    title: "Смета до начала работ",
    text: "Фиксируем состав задач после замера с учётом состояния объекта и выбранных материалов.",
    Icon: ClipboardCheck
  },
  {
    title: "Контроль качества",
    text: "Проверяем ключевые этапы и согласования, чтобы вы видели ход ремонта без сюрпризов.",
    Icon: ShieldCheck
  },
  {
    title: "Работа по этапам",
    text: "От заявки до сдачи объекта — понятная последовательность шагов и поэтапная приёмка.",
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
            {PROJECT_SLOGAN}. Бесплатный выезд на замер, понятная смета до начала работ,
            подбор мастеров и контроль качества на каждом этапе. Работаем по всем городам КМВ.
          </p>

          <ul className="hero-bullets" aria-label="Ключевые условия">
            <li>
              <Check size={18} aria-hidden="true" />
              Бесплатный выезд на замер
            </li>
            <li>
              <Check size={18} aria-hidden="true" />
              Смета до начала работ
            </li>
            <li>
              <Check size={18} aria-hidden="true" />
              Специалисты 10+ лет
            </li>
            <li>
              <Check size={18} aria-hidden="true" />
              Контроль качества на каждом этапе
            </li>
          </ul>

          <div className="hero-actions">
            <a className="button button-primary" href="#lead-form">
              <span>Получить бесплатный замер</span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <TrackedLink
              className="button button-secondary"
              href={TELEGRAM_URL}
              goal={METRICA_GOALS.telegramClick}
            >
              <Send size={18} aria-hidden="true" />
              <span>Написать в Telegram</span>
            </TrackedLink>
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
            Основной профиль — отделка, ремонт квартир и работы по ванной, санузлу и плитке.
            Также строим дома, делаем электрику, кровлю и кладку по всему КМВ.
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
          <h2>Практичный подход без громких обещаний</h2>
          <p>
            Мы не обещаем точную цену до осмотра и не украшаем сайт выдуманными наградами.
            Вместо этого — замер, смета и контроль на каждом этапе.
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
            Заявка сразу попадает к команде: мы перезваниваем, согласуем выезд на замер
            и дальше ведём объект по понятным этапам — без потерянных звонков и «забытых» смет.
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
          <h2>Рассчитайте предварительную стоимость по площади и типу работ</h2>
          <p>
            Калькулятор помогает быстро сориентироваться и передать задачу нашей команде.
            Он не показывает точные цены и не заменяет смету после осмотра объекта.
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
            Внутренняя отделка, строительство домов, фасадные, ландшафтные и промышленные
            работы нашей команды. Выберите направление и посмотрите фото крупнее.
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
            Оставьте контакты — уточним город, объект, тип работ и удобное время для выезда.
            Итоговая смета готовится после осмотра и согласования материалов.
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
              {PROJECT_NAME} базируется в Ессентуках и работает по всем Кавказским
              Минеральным Водам: Кисловодск, Железноводск, Пятигорск и соседние
              населённые пункты по согласованию.
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
    </main>
  );
}
