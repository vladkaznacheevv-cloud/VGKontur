# Project Documentation Index

This folder contains the working documentation for the KMV construction and renovation website.

## Where Data Lives

- `00-project-brief/` - project idea, business model, risk register and general brief.
- `01-market-research/` - competitor and market research.
- `02-advertising/` - Yandex Direct strategy, semantic structure, budget, minus words, KPIs and advertising source of truth.
- `03-operations/` - lead handling, Telegram-group process, owner/partner roles and request statuses.
- `04-design/` - approved design direction, reference prompt, design research and design source of truth.
- `05-site-architecture/` - MVP page structure, required blocks, calculator and form requirements.
- `06-content/` - copy rules, offers, CTA and section content requirements.
- `07-seo-geo/` - Essentuki-first SEO/GEO strategy and future KMV rollout logic.
- `08-image-generation/` - GPT Images workflow, asset plan and image prompts.
- `09-technical/` - future stack notes, Telegram integration notes, implementation constraints and production operations runbook.
- `archive/legacy/` - old package indexes, outdated plans and historical materials kept for traceability.

## Current Sources Of Truth

- Project brief: `00-project-brief/01_PROJECT_BRIEF.md`.
- Advertising: `02-advertising/ADVERTISING_SOURCE_OF_TRUTH.md`.
- Operations: `03-operations/OPERATIONS_SOURCE_OF_TRUTH.md`.
- Design: `04-design/DESIGN_SOURCE_OF_TRUTH.md`.
- Site blocks: `05-site-architecture/SITE_BLOCKS_AND_CONTENT_REQUIREMENTS.md`.
- SEO/GEO: `07-seo-geo/SEO_GEO_SOURCE_OF_TRUTH.md`.
- Image workflow: `08-image-generation/IMAGE_GENERATION_WORKFLOW.md`.
- Technical notes: `09-technical/TECHNICAL_NOTES.md`.
- Production operations (domain, deploy, lead storage, security): `09-technical/PRODUCTION_OPERATIONS.md`.

## Approved Design Reference

- Reference mockup: `../references/design/selected-clean-local-expert-desktop-mockup.png`.
- Selected design prompt: `04-design/26_SELECTED_PROMPT_CLEAN_LOCAL_EXPERT_DESKTOP.md`.
- Direction: Direction A - Clean Local Expert / Desktop.

## Advertising Analytics

Advertising strategy and Yandex Direct planning are in `02-advertising/`.

Raw forecast XLS/XLSX exports are stored in:

- `../references/ads-forecasts/` for raw exports;
- `02-advertising/` for interpreted summaries.

## Operational Model

The operational model is fixed in `03-operations/OPERATIONS_SOURCE_OF_TRUTH.md`.

Current decision:

- CRM is not used at launch.
- Leads go to a Telegram group.
- Owner and partner process leads manually.

## GPT Images Prompts

- Workflow: `08-image-generation/IMAGE_GENERATION_WORKFLOW.md`.
- Prompt set: `08-image-generation/IMAGE_PROMPTS.md`.
- Reusable prompt files: `../prompts/gpt-images/`.

## Skills

- Project-relevant Codex skills are installed globally at `C:\Users\User\.agents\skills`, not inside this repository.
- Global library status is tracked by `C:\Users\User\.agents\.skill-lock.json`.
- Use `impeccable` for structure, visual consistency, UI/QA and file hygiene when relevant.
- Use the SEO/GEO skills library for Essentuki-first SEO/GEO work and future KMV rollout planning.
- Use `skill-creator` only when a new or updated skill is needed.
- Use `find-skills` to discover available skills.
- Restart Codex before new sessions if newly installed global skills are not visible.

## Approved

- Essentuki-first launch.
- Main offer around renovation and finishing in Essentuki.
- 30 000-50 000 RUB first-month Yandex Direct budget.
- Main launch directions: apartment renovation/finishing and bathroom/toilet/tile.
- CRM-free lead handling through Telegram group.
- Design Direction A - Clean Local Expert / Desktop.
- Brand/project name: `VG Контур`.
- Header/logo variant: `VG КОНТУР`.
- Descriptor: `Ремонт и отделка по КМВ`.
- Slogan: `Ремонт без хаоса: замер, смета, контроль`.
- Primary logo source: `../assets/source/brand/vg-kontur-logo-primary.svg`.
- Public phone: `89620033574`.
- WhatsApp: `https://wa.me/79620033574`.
- Telegram public contact: `@VGKontur`.
- Telegram public link: `https://t.me/VGKontur`.
- Telegram env names: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
- Telegram group and bot for site leads are created; real credentials must stay outside repository files.
- Exact prices are not shown on the MVP page.
- `/privacy` page is required if forms are present.

## Requires Agreement Before Stage 4

- `/privacy` page content.
