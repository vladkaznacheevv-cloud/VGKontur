# Project Agent Instructions

## Project

This repository is for an MVP website for construction, renovation and finishing services across KMV.

The first commercial and operational launch is **Essentuki-first**. The site must convert Yandex Direct search traffic into phone, WhatsApp, Telegram and form leads.

Main offer:

> Ремонт и отделочные работы в Ессентуках с бесплатным замером, понятной сметой и контролем качества на каждом этапе.

## Business Goal

- Launch a practical MVP landing page for paid search validation.
- Focus the first month on Essentuki with a 30 000-50 000 RUB Yandex Direct budget.
- Get qualified renovation/finishing leads, measure cost per real measurement visit and signed contract, then scale.
- City rollout priority: Essentuki first, then Kislovodsk, Zheleznovodsk, Pyatigorsk.

## Advertising Basis

- Main channel at launch: Yandex Direct search.
- Google Ads is not the main channel for the Russian launch.
- Main launch directions:
  - apartment renovation / finishing;
  - bathroom / toilet / tile.
- Small tests:
  - electrical work;
  - house construction.
- Later directions:
  - roofing;
  - stone masonry.
- Advertising decisions must influence the site structure, copy, forms, service priorities and lead qualification.
- Source of truth: `docs/02-advertising/ADVERTISING_SOURCE_OF_TRUTH.md`.

## Operations

- CRM is not used at launch.
- Leads go to a Telegram group where the owner and partner are present.
- Basic flow: site form -> Telegram group -> manual processing.
- Owner/partner roles:
  - owner or partner replies to new leads;
  - owner does measurement visits;
  - owner prepares estimates;
  - partner agrees price;
  - partner chooses crew;
  - owner controls the object;
  - owner and partner handle warranty/conflicts together.
- Do not expose Telegram bot token, chat id, invite links or personal data in code, logs or docs.
- Source of truth: `docs/03-operations/OPERATIONS_SOURCE_OF_TRUTH.md`.

## Design Direction

Approved direction: **Direction A - Clean Local Expert / Desktop**.

Use the reference as a design benchmark, not a pixel-perfect requirement.

- Reference mockup: `references/design/selected-clean-local-expert-desktop-mockup.png`.
- Approved prompt: `docs/04-design/26_SELECTED_PROMPT_CLEAN_LOCAL_EXPERT_DESKTOP.md`.
- Design source of truth: `docs/04-design/DESIGN_SOURCE_OF_TRUTH.md`.

Visual style:

- light warm minimalism;
- trustworthy local expert;
- clean construction aesthetic;
- off-white and warm stone base;
- graphite text;
- muted green or deep blue accents;
- subtle plaster/concrete texture;
- no luxury real estate look;
- no cheap construction template;
- no dark brutalist, neon, 3D or fintech style.

## Required Site Blocks

The MVP page must include:

- header with logo/project name, navigation, phone, WhatsApp/Telegram CTA;
- first screen about renovation and finishing in Essentuki;
- free measurement, estimate and quality control message;
- services grid;
- trust section;
- process timeline;
- preliminary calculator;
- lead form;
- contacts and service area;
- footer with legal/privacy links if forms are present.

Detailed requirements: `docs/05-site-architecture/SITE_BLOCKS_AND_CONTENT_REQUIREMENTS.md`.

## Text Rules

- Write in clear Russian for local Essentuki/KMV customers.
- Keep the first screen focused on renovation and finishing in Essentuki.
- Use practical trust language, not exaggerated awards or unsupported claims.
- Do not promise exact final prices before measurement.
- Mention that final estimate depends on object condition, scope and materials.
- Keep CTAs direct: request measurement, estimate cost, contact via WhatsApp/Telegram.
- Avoid fake company history, fake cases, fake reviews and fake certifications.

Content source: `docs/06-content/CONTENT_REQUIREMENTS.md`.

## SEO/GEO Rules

- Essentuki is the first SEO/GEO priority.
- KMV is a service area, not the initial main advertising focus.
- Future expansion pages should follow this order: Kislovodsk, Zheleznovodsk, Pyatigorsk.
- Service pages/sections must preserve local intent: city + service + commercial action.
- Use SEO/GEO guidance from `docs/07-seo-geo/SEO_GEO_SOURCE_OF_TRUTH.md`.

## Image Generation Workflow

- Codex must not generate project images unless the user explicitly asks and an image-generation tool is available.
- For this project, first prepare prompts, asset slots, naming and integration notes.
- All project image-generation docs and prompts must be kept under `docs/08-image-generation/`.
- Reusable prompt files also live under `prompts/gpt-images/`.
- Final assets must use clear names and slots:
  - `hero`;
  - `services`;
  - `calculator`;
  - `process`;
  - `trust`;
  - `contacts-map`;
  - `og-image`.
- Raw/source assets go to `assets/source/`.
- Generated assets go to `assets/generated/`.
- Optimized web assets go to `assets/optimized/`.
- Workflow source: `docs/08-image-generation/IMAGE_GENERATION_WORKFLOW.md`.

## Skills And Working Methods

Project skills are installed globally in the user skills library, not inside this repository.

- Global skills path: `C:\Users\User\.agents\skills`.
- Install source: `D:\projects\project3\.agents\skills`.
- Global lock file: `C:\Users\User\.agents\.skill-lock.json`.
- Total global library size: 23 skills.
- Codex may need a restart before newly installed global skills are available in new sessions.

Installed skills to use when relevant:

- `impeccable`: use for production-level structure, consistency, visual strictness, QA and file hygiene.
- `SEO/GEO skills library`: 20 skill folders from `aaron-he-zhu/seo-geo-claude-skills`; use for Essentuki-first SEO/GEO architecture and later KMV scaling.
- `skill-creator`: use only when creating or updating a new Codex skill is needed.
- `find-skills`: use to discover available skills and decide which skill fits a task.
- `gpt images / image generation workflow`: use for image prompt planning, asset slots, naming and safe integration.

Do not copy global skills into `/project4` and do not document them as local project files.

## Future Technical Implementation

- Keep the MVP simple, fast and maintainable.
- Do not introduce CRM during the first launch.
- Forms must be ready for Telegram-group delivery.
- Use environment variables for secrets.
- Keep `.env.example` safe and without real tokens.
- Do not commit real tokens, chat ids, phone-private notes, raw PII exports or invite links.
- Do not log PII from forms.
- Validate and sanitize form inputs.
- Add rate limiting / spam protection before paid traffic if a backend endpoint exists.
- Add Yandex Metrica goals for form submit, phone/WhatsApp/Telegram clicks and calculator lead submit.

## File Rules

- Do not delete current source materials without explicit approval.
- If a source is outdated, duplicate or uncertain, move it to `docs/archive/legacy/` with a reason in the task report.
- Preserve final decisions, advertising forecasts, operational docs, selected design references and selected prompts.
- Keep generated images separate from source references.
- Use stable, descriptive filenames.
- Do not store secrets in docs, commits, examples, logs or screenshots.

## Task Report Rules

After each substantial task, report:

- files created/updated;
- files moved/archived;
- source-of-truth documents affected;
- checks performed;
- unresolved questions or assumptions;
- whether the project is ready for the next stage.
