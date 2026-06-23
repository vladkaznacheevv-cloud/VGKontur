# Technical Notes

## MVP Principles

- Keep the first version simple and fast.
- Build for Yandex Direct traffic and quick iteration.
- Avoid adding CRM at launch.
- Keep site structure compatible with later service/city expansion.
- Use the approved brand/project name `VG Контур`.
- Do not show exact service prices on the MVP page.

## Brand Assets

- Main brand name: `VG Контур`.
- Header/logo variant: `VG КОНТУР`.
- Descriptor: `Ремонт и отделка по КМВ`.
- Slogan: `Ремонт без хаоса: замер, смета, контроль`.
- Primary logo source: `assets/source/brand/vg-kontur-logo-primary.svg`.
- Logo alternatives: `assets/source/brand/vg-kontur-logo-corner.svg` and `assets/source/brand/vg-kontur-logo-grid.svg`.

## Public Contacts For MVP

- Public phone: `89620033574`.
- Public phone display: `+7 (962) 003-35-74`.
- WhatsApp link: `https://wa.me/79620033574`.
- Telegram public contact: `@VGKontur`.
- Telegram public link: `https://t.me/VGKontur`.

Do not store private contact notes, invite links, Telegram bot tokens, chat ids or lead PII in repository files, logs, docs or screenshots.

## Forms And Telegram

Lead forms should be ready to send data to a Telegram group.

Current status:

- Telegram group for site leads is created.
- Telegram bot for site leads is created.
- Real `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` must be configured only in the deployment environment or local ignored env files.

Required fields:

- name;
- phone;
- city;
- work type;
- comment.

Security rules:

- Telegram bot token must be stored only in environment variables.
- Telegram chat id must not be committed in real form.
- `.env.example` may contain placeholder names only.
- Do not log full form payloads with PII.
- Validate and sanitize all fields.
- Add rate limiting/spam protection before paid traffic.

Telegram notification titles:

- Regular lead form: `Новая заявка на замер`.
- Calculator estimate form: `🧾 Отправлена новая предварительная смета`.

The calculator estimate notification should include name, phone, city, object type, area, repair type, comment, preliminary cost, calculation date and disclaimer.

If Telegram env is missing, `/api/lead` may return 503. The UI must show a friendly message instead of raw network/API errors:

> Не удалось отправить заявку. Попробуйте ещё раз или напишите нам в WhatsApp/Telegram.

Suggested environment variable placeholders:

- `TELEGRAM_BOT_TOKEN=replace_me`
- `TELEGRAM_CHAT_ID=replace_me`
- `NEXT_PUBLIC_YANDEX_MAPS_API_KEY=replace_me`

Do not fill these placeholders with real values in repository files.

## Pricing And Calculator

- MVP must not show exact final prices as a promise.
- Use wording around "расчёт после замера".
- The calculator may provide only a "предварительная оценка по площади и типу работ".
- Calculator shows a preliminary range using VG Контур working rates.
- Rates are working rates for a preliminary estimate; the final estimate is formed after measurement.
- Formula: area x rate range by repair type.
- The on-page result must include object type, area, city, repair type, preliminary range, approximate timeline if safely calculated and disclaimer.
- The preliminary estimate should be printable/saveable through browser print or a lightweight printable section, without heavy PDF libraries.
- Near calculator and pricing-related form copy, state that "финальная смета зависит от состояния объекта, материалов и объёма работ".
- Pricing block should be revised later, after prices are collected and stabilized from real projects.

## Yandex Maps

- Use `NEXT_PUBLIC_YANDEX_MAPS_API_KEY` for Yandex Maps integration when available.
- Keep service area city points centralized and city-level only:
  - Essentuki;
  - Kislovodsk;
  - Zheleznovodsk;
  - Pyatigorsk.
- Essentuki is the main center.
- Do not publish exact addresses in map points.
- If the public maps key is absent or the script fails, render a styled fallback instead of breaking the page.

## Privacy And Consent

- Create a `/privacy` page if forms are present.
- Link to `/privacy` from the footer and near form consent where appropriate.
- Under every form, show this consent text (the words «Политикой конфиденциальности» link to `/privacy`):

> Нажимая кнопку, вы соглашаетесь с обработкой персональных данных и Политикой конфиденциальности.

## Analytics

Before launch, prepare Yandex Metrica goals for:

- form submit;
- calculator submit;
- phone click;
- WhatsApp click;
- Telegram click.

Use UTM tags for Yandex Direct campaigns.

## Future Stack

No stack is fixed yet. Choose conservatively during Stage 4 based on the actual implementation request.

Requirements for any stack:

- fast first load;
- responsive layout;
- accessible form controls;
- safe secret handling;
- clear deploy path;
- simple content updates;
- asset optimization pipeline.
