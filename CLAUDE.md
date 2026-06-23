# CLAUDE.md

Guidance for Claude Code when working in this repository. Дополняет `AGENTS.md` — при расхождении приоритет у `AGENTS.md` и у source-of-truth документов.

## Проект

**VG Контур** — MVP-лендинг для ремонта и отделочных работ.

- Главный фокус: **ремонт и отделочные работы в Ессентуках**; КМВ (Кисловодск, Железноводск, Пятигорск) — зона работы, а не основной рекламный фокус.
- Цель: конвертировать трафик Яндекс.Директа в заявки (телефон, WhatsApp, Telegram, форма).
- Лиды уходят в Telegram-группу. CRM на старте нет.
- Бренд: `VG Контур`; шапка/лого: `VG КОНТУР`; дескриптор: `Ремонт и отделка по КМВ`; слоган: `Ремонт без хаоса: замер, смета, контроль`.

## Стек

- **Next.js 15 / React 19 / TypeScript / App Router**.
- Иконки — `lucide-react`. Изображения — `next/image` (оптимизированные `.webp` из `assets/optimized/`).
- Без CSS-фреймворка: единый глобальный стиль `app/globals.css`, дизайн-токены на **OKLCH** в `:root`.
- Алиас путей `@/*` → корень репозитория (см. `tsconfig.json`).
- `package.json` name: `essentuki-renovation-mvp`. Скрипты: `dev`, `build`, `start`, `typecheck`. Lint/test-скриптов нет.
- Сейчас это **не git-репозиторий** (нет `.git`).

## Дизайн

**Direction A — Clean Local Expert / Desktop** (утверждён).

- Светлый тёплый минимализм: off-white / warm stone фон, графитовый текст, акценты — приглушённый зелёный и при необходимости глубокий синий.
- Reference-макет: `references/design/selected-clean-local-expert-desktop-mockup.png` (бенчмарк, не pixel-perfect).
- Не использовать: luxury-стиль недвижимости, дешёвый стройшаблон, dark/brutalist, neon/fintech, лишний 3D, фейковые награды/отзывы, грязные стройплощадки, нереалистичные AI-руки.

## Структура кода

- `app/page.tsx` — единственный лендинг (header, hero, услуги, доверие, этапы, калькулятор, работы, форма, контакты, footer).
- `app/api/lead/route.ts` — приём заявок: honeypot, rate-limit (5 / 10 мин на IP), отправка в Telegram, безопасные тексты ошибок.
- `app/privacy/page.tsx` — `/privacy` (обязательна при формах).
- `app/layout.tsx` — метаданные, `lang="ru"`.
- `components/` — `BrandLogo`, `LeadForm` (варианты `lead` и `calculator`), `TrackedLink`, `YandexServiceMap` (со styled-fallback без API-ключа).
- `lib/` — `contacts` (бренд/контакты), `estimate` (рабочие ставки + расчёт), `leadValidation` (нормализация/санитайз), `telegram` (формат + отправка), `metrica` + `metricaGoals` (цели), `serviceArea` (города КМВ).
- Бренд и контакты — единый источник `lib/contacts.ts`; не хардкодить телефон/ссылки в разметке.

## Source-of-truth документы

- Индекс: `docs/README.md`.
- Бриф: `docs/00-project-brief/01_PROJECT_BRIEF.md`.
- Реклама: `docs/02-advertising/ADVERTISING_SOURCE_OF_TRUTH.md`.
- Операции: `docs/03-operations/OPERATIONS_SOURCE_OF_TRUTH.md`.
- Дизайн: `docs/04-design/DESIGN_SOURCE_OF_TRUTH.md`.
- Блоки сайта/контент: `docs/05-site-architecture/SITE_BLOCKS_AND_CONTENT_REQUIREMENTS.md`.
- Контент-правила: `docs/06-content/CONTENT_REQUIREMENTS.md`.
- SEO/GEO: `docs/07-seo-geo/SEO_GEO_SOURCE_OF_TRUTH.md`.
- Изображения: `docs/08-image-generation/IMAGE_GENERATION_WORKFLOW.md`.
- Технические заметки + чек-лист: `docs/09-technical/TECHNICAL_NOTES.md`, `docs/09-technical/STAGE_4_READINESS_CHECKLIST.md`.

Перед изменением текста/структуры/цен сверяться с этими документами.

## Контент и цены (кратко)

- Первый экран — про ремонт и отделку **в Ессентуках**; не подменять оффер общим «по КМВ».
- Точные финальные цены не показывать. Калькулятор даёт только «предварительную оценку по площади и типу работ»; ставки калькулятора — рабочие ставки VG Контур для предварительного расчёта, финальная смета формируется после замера.
- Обязательный дисклеймер: «Стоимость предварительная. Точная смета составляется после замера…».
- Под каждой формой: «Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.»
- Раздел «Наши работы» — только честные плейсхолдеры, пока нет согласованных реальных объектов.
- Не выдумывать отзывы, награды, сроки, кейсы, лицензии.

## Безопасность (обязательно)

- **Не показывать и не логировать secrets и PII** (токены, chat id, телефоны клиентов, содержимое заявок).
- **Реальные `.env` не читать и не выводить.** `.env.local` содержит боевые значения и закрыт `.gitignore` — не открывать его. Работать только с `.env.example` (плейсхолдеры).
- Секреты только в env: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (server-side). Публичные: `NEXT_PUBLIC_TELEGRAM_URL`, `NEXT_PUBLIC_YANDEX_METRICA_ID`, `NEXT_PUBLIC_YANDEX_MAPS_API_KEY`.
- В `.env.example` держать только `replace_me`/плейсхолдеры; реальные токены никогда не коммитить, не класть в docs/логи/скриншоты.
- Не логировать полный payload формы. Все поля валидировать и санитайзить (`lib/leadValidation.ts`).

## Изображения

- Картинки в `assets/optimized/`, `assets/generated/` — **AI-сгенерированные визуалы сайта**. Никогда не называть их реальными выполненными работами VG Контур.
- **Реальные фото для раздела «Наши работы» лежат в `references/Photo/`** (подпапки: `Exterior work`, `finishing work`, `Home Builders`, `Industrial construction work`, `Landscape construction work`). Это исходные фото объектов; интегрировать только после явного согласования.

## Git и процесс

- **Git-операции не выполнять без явной команды** пользователя (репозиторий сейчас не инициализирован).
- **Перед правками кода сначала давать краткий план**, затем выполнять.
- **Отчёты делать кратко**: что создано/изменено, что проверено, открытые вопросы.
- Source-материалы не удалять без подтверждения; устаревшее переносить в `docs/archive/legacy/` с причиной.

## Команды

```bash
npm install
npm run dev        # локальная разработка
npm run build      # прод-сборка
npm run typecheck  # tsc --noEmit (используй для проверки правок)
```

## Известные пробелы (на заметку, не баги к немедленной правке)

- **Яндекс.Метрика подключена**: счётчик инициализируется в `components/YandexMetrica.tsx` (рендерится из `app/layout.tsx`), цели шлёт `lib/metrica.ts` → `window.ym`. Production counter — `110037967` (через `NEXT_PUBLIC_YANDEX_METRICA_ID`; рендерится только при валидном числовом id, иначе no-op, чтобы плейсхолдеры из `.env.example` не попадали в разметку). Цели: `phone_click`, `whatsapp_click`, `telegram_click`, `form_submit`, `calculator_submit`.
- Тестов в репозитории нет (папка `test-results/` — артефакт прошлого прогона, конфигов/тестов не закоммичено).
- Текст `/privacy` и реквизиты оператора ПДн зафиксированы (единый источник `lib/contacts.ts` → `PERSONAL_DATA_OPERATOR`; данные продублированы в `docs/09-technical/PRODUCTION_OPERATIONS.md`).
- Требует действий вне кода до боевого запуска: боевые Telegram-креды (только в окружении деплоя). Уведомление Роскомнадзора об обработке персональных данных подано. Ожидается обработка / появление сведений в реестре.
