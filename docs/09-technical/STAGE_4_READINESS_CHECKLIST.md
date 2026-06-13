# Stage 4 Readiness Checklist

## Documentation Status

- Project documentation is collected under `docs/`.
- `AGENTS.md` exists and contains project agent instructions.
- `docs/04-design/DESIGN_SOURCE_OF_TRUTH.md` exists.
- `docs/02-advertising/ADVERTISING_SOURCE_OF_TRUTH.md` exists, and forecast files are added under `references/ads-forecasts/`.
- `docs/03-operations/OPERATIONS_SOURCE_OF_TRUTH.md` exists.
- `docs/06-content/CONTENT_REQUIREMENTS.md` exists.
- `docs/05-site-architecture/SITE_BLOCKS_AND_CONTENT_REQUIREMENTS.md` exists.
- `docs/07-seo-geo/SEO_GEO_SOURCE_OF_TRUTH.md` exists.
- `docs/08-image-generation/IMAGE_GENERATION_WORKFLOW.md` exists.
- Selected design reference is saved at `references/design/selected-clean-local-expert-desktop-mockup.png`.

## Skills Status

- Global user skills are installed at `C:\Users\User\.agents\skills`.
- Source used for installation: `D:\projects\project3\.agents\skills`.
- Global lock file is updated at `C:\Users\User\.agents\.skill-lock.json`.
- Total global library size: 23 skills.
- Installed project-relevant skills:
  - `impeccable` for production-level structure, consistency, UI/QA and file hygiene;
  - SEO/GEO skills library: 20 skill folders from `aaron-he-zhu/seo-geo-claude-skills` for Essentuki-first SEO/GEO and future KMV scaling;
  - `skill-creator` from `C:\Users\User\.codex\skills\.system\skill-creator\SKILL.md`, only when creating or updating a skill is needed;
  - existing `find-skills` for discovering available skills.
- Skills are global user-library assets, not local `/project4` project files.
- Do not copy skills into this repository.
- Restart Codex before new sessions if newly installed global skills are not visible.

## Final MVP Inputs Before Stage 4

- Brand / project name: `VG Контур`.
- Header/logo variant: `VG КОНТУР`.
- Descriptor: `Ремонт и отделка по КМВ`.
- Slogan: `Ремонт без хаоса: замер, смета, контроль`.
- Primary logo source: `assets/source/brand/vg-kontur-logo-primary.svg`.
- Public phone: `89620033574`.
- Public phone display: `+7 (962) 003-35-74`.
- WhatsApp: `https://wa.me/79620033574`.
- Telegram public contact: `@VGKontur`.
- Telegram public link: `https://t.me/VGKontur`.
- Telegram group for site leads: created.
- Telegram bot for site leads: created.
- Telegram environment variable names:
  - `TELEGRAM_BOT_TOKEN`;
  - `TELEGRAM_CHAT_ID`.
- `.env.example` must keep `TELEGRAM_BOT_TOKEN=replace_me` and `TELEGRAM_CHAT_ID=replace_me`.
- Real Telegram bot token and chat id must stay only in deployment environment or local ignored env files.
- Exact service prices are not shown on the MVP page.
- Calculator / estimate wording must use:
  - "расчёт после замера";
  - "предварительная оценка по площади и типу работ";
  - "финальная смета зависит от состояния объекта, материалов и объёма работ".
- Calculator may show preliminary ranges from a temporary MVP rate table, marked with `TODO: уточнить по Ставропольскому краю.`
- Calculator output must not be presented as a final price or legal estimate.
- Preliminary estimate download/save can use browser print or a lightweight printable section.
- Calculator Telegram notification title: `🧾 Отправлена новая предварительная смета`.
- Regular lead form Telegram notification title: `Новая заявка на замер`.
- Works section may use only honest placeholders until real objects are approved.
- Yandex Maps integration should use `NEXT_PUBLIC_YANDEX_MAPS_API_KEY` when available and a styled fallback when absent.
- City map points must stay city-level only, without exact addresses.
- Pricing block is deferred until real prices are collected and stabilized.
- A `/privacy` page is required if forms are present.
- Under every form, show:

> Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.

## Batch 2 Visual Assets

- Batch 2 generated image assets are prepared and integrated.
- Generated PNG sources are saved in `assets/generated/`.
- Optimized WebP assets are saved in `assets/optimized/`.
- Integrated slots:
  - `hero-renovation-essentuki-v01.webp`;
  - `service-finishing-v01.webp`;
  - `service-apartment-renovation-v01.webp`;
  - `service-bathroom-tile-v01.webp`;
  - `service-electrical-panel-v01.webp`;
  - `service-house-construction-v01.webp`;
  - `service-roofing-v01.webp`;
  - `service-masonry-v01.webp`;
  - `calculator-estimate-v01.webp`;
  - `process-quality-control-v01.webp`;
  - `contacts-kmv-fallback-v01.webp`.
- Images are AI-generated website visuals and must not be described as real VG Kontur completed projects.
- The works section remains an honest placeholder until real approved objects are available.
- `next/image` is used for page image delivery with explicit alt handling and stable dimensions.

## Still Needed Before Stage 4 Implementation

- Configure real Telegram credentials in deployment environment without committing them.
