# Site Blocks And Content Requirements

## MVP Contact And Legal Inputs

- Brand/project name: `VG Контур`.
- Header/logo variant: `VG КОНТУР`.
- Descriptor: `Ремонт и отделка по КМВ`.
- Slogan: `Ремонт без хаоса: замер, смета, контроль`.
- Public phone: `89620033574`.
- Public phone display format on the site: `+7 (962) 003-35-74`.
- WhatsApp: `https://wa.me/79620033574`.
- Telegram public contact: `@VGKontur`.
- Telegram public link: `https://t.me/VGKontur`.
- Privacy page: `/privacy`.
- Under every form, show:

> Нажимая кнопку, вы соглашаетесь с обработкой персональных данных и Политикой конфиденциальности.

## Header

Required elements:

- primary SVG logo `assets/source/brand/vg-kontur-logo-primary.svg`;
- project name `VG Контур`;
- navigation;
- public phone displayed as `+7 (962) 003-35-74` with working `tel:+79620033574`;
- WhatsApp CTA linked to `https://wa.me/79620033574`;
- Telegram CTA linked to `https://t.me/VGKontur`.

## First Screen

Required message:

- ремонт и отделочные работы в Ессентуках;
- бесплатный замер;
- понятная смета;
- контроль качества;
- button for a lead request.

Recommended headline:

> Ремонт и отделочные работы в Ессентуках с бесплатным замером и контролем качества

Recommended support copy:

> Организуем ремонт под ключ: выезд, замер, смета, подбор мастеров, контроль работ и поэтапная сдача объекта.

Required trust bullets:

- бесплатный выезд на замер;
- смета до начала работ;
- специалисты 10+ лет;
- контроль качества на каждом этапе.

## Services

Required services:

- отделка;
- ремонт квартир;
- ванная/санузел;
- электрика;
- строительство домов;
- кровля;
- кладка.

Priority:

- main launch: отделка, ремонт квартир, ванная/санузел/плитка;
- small tests: электрика, строительство домов;
- later: кровля, кладка.

## Why Trust Us

Required points:

- специалисты 10+ лет;
- контроль работ;
- работа по этапам;
- согласование сметы до начала работ;
- контроль качества.

Rules:

- no fake awards;
- no unsupported claims;
- keep wording practical and verifiable.

## How We Work

Required steps:

1. Заявка.
2. Консультация.
3. Выезд.
4. Смета.
5. Согласование.
6. Выполнение.
7. Контроль.
8. Сдача.

## Calculator

Required fields:

- имя;
- тип объекта;
- площадь;
- тип ремонта;
- город;
- контакт.

MVP rule:

The calculator gives a lead qualification signal and "предварительная оценка по площади и типу работ" only. It shows a preliminary range based on VG Контур working rates, but must not promise a final legal price before measurement.

Required disclaimer:

> Стоимость предварительная. Точная смета составляется после замера специалиста и зависит от состояния объекта, материалов и объёма работ.

Pricing rule:

- Do not show exact final prices as a promise.
- Use VG Контур working rates for the preliminary estimate.
- Rates are working rates for a preliminary estimate; the final estimate is formed after measurement.
- Formula: area x rate range by repair type.

Estimate output must include:

- тип объекта;
- площадь;
- город;
- тип ремонта;
- предварительная стоимость or диапазон;
- примерный срок if safely calculated;
- disclaimer.

The preliminary estimate must be printable/saveable through browser print or a lightweight printable view. It must include `VG Контур`, phone, WhatsApp, Telegram, calculation date, object parameters, preliminary calculation and disclaimer.

When a calculator estimate is submitted, Telegram must receive a separate notification with this title:

> 🧾 Отправлена новая предварительная смета

The regular lead form title remains:

> Новая заявка на замер

The Telegram estimate notification must include name, phone, city, object type, area, repair type, comment, preliminary cost, date and disclaimer.

## Works

Add a section between the calculator and bottom lead form.

Required structure for 5-6 future objects:

- photo slot;
- object type;
- city/district;
- works;
- timeline;
- result;
- CTA.

Content rule:

- Do not invent real objects, addresses or timelines.
- Until real data exists, use honest placeholder wording such as `Скоро добавим реальные объекты` and `Раздел готовится к наполнению`.
- Do not present generated or placeholder images as real completed work.

## Lead Form

Required fields:

- имя;
- телефон;
- город;
- тип работ;
- комментарий.

Destination:

- Telegram group at launch.

CRM:

- CRM is not used at launch.

Required consent text under the form:

> Нажимая кнопку, вы соглашаетесь с обработкой персональных данных и Политикой конфиденциальности.

## Contacts

Required contacts:

- телефон `89620033574`, displayed as `+7 (962) 003-35-74`;
- WhatsApp `https://wa.me/79620033574`;
- Telegram `https://t.me/VGKontur`;
- зона работы: Ессентуки и КМВ.

Map requirement:

- Prepare Yandex Maps integration.
- Centralize city points without exact addresses: Ессентуки, Кисловодск, Железноводск, Пятигорск.
- Use Essentuki as the main center.
- If `NEXT_PUBLIC_YANDEX_MAPS_API_KEY` is missing, show a styled fallback instead of breaking the site.

Recommended geo copy:

> Базируемся в Ессентуках. Работаем по КМВ: Ессентуки, Кисловодск, Железноводск, Пятигорск и соседние населённые пункты по согласованию.

## Footer

Required if forms are present:

- project/company name `VG Контур`;
- contacts;
- service area;
- privacy policy link to `/privacy`;
- short note that a request is not a public offer or final estimate.
