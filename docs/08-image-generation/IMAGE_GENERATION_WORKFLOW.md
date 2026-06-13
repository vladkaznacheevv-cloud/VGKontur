# Image Generation Workflow

## Purpose

This workflow prepares image production for the construction and renovation MVP website. It is written for GPT Images or an equivalent approved image-generation tool.

Codex should not generate project images unless the user explicitly asks for generation and an image-generation tool is available. Until then, Codex prepares prompts, slots, filenames and integration instructions.

## Source And Output Folders

- Approved design reference: `../../references/design/selected-clean-local-expert-desktop-mockup.png`.
- Image prompt docs: `../08-image-generation/`.
- Reusable prompt files: `../../prompts/gpt-images/`.
- Raw/source images: `../../assets/source/`.
- Generated image outputs: `../../assets/generated/`.
- Optimized web images: `../../assets/optimized/`.

## Required Asset Slots

| Slot | Purpose | Suggested Size |
|---|---|---:|
| hero | First-screen renovation/interior visual | 1920x1280 or 2400x1600 |
| services | Service card visuals or cropped set | 1600x1200 |
| calculator | Clean measuring/estimate visual | 1600x1200 |
| process | Work process / measurement / material detail | 1600x1200 |
| trust | Quality control / clean craft detail | 1600x1200 |
| contacts-map | Essentuki/KMV map-style or local context visual | 1600x1200 |
| og-image | Social preview image | 1200x630 |

## Naming Convention

Use lowercase Latin filenames:

- `hero-renovation-essentuki-v01.png`
- `services-apartment-finishing-v01.png`
- `calculator-measurement-estimate-v01.png`
- `process-quality-control-v01.png`
- `trust-clean-craft-v01.png`
- `contacts-kmv-service-area-v01.png`
- `og-image-renovation-essentuki-v01.png`

Optimized files should keep the same base name and use web formats where appropriate:

- `.webp` for page images;
- `.jpg` for photographic fallbacks;
- `.png` only when transparency or lossless detail is required.

## Prompt Rules

All prompts must preserve Direction A:

- clean local expert;
- light warm minimalism;
- realistic renovation/interior visuals;
- Essentuki/KMV local service context;
- practical construction details;
- no luxury real estate excess;
- no cheap template visuals.

Prompts must include:

- asset slot;
- intended site placement;
- scene/subject;
- style;
- color palette;
- composition;
- constraints;
- avoid list.

Use `IMAGE_PROMPTS.md` as the canonical prompt set and mirror reusable prompts in `../../prompts/gpt-images/`.

## Visuals To Avoid

- close-up faces;
- dirty construction sites;
- cheap stock-like construction pictures;
- unnatural AI hands;
- luxury villas that do not match local renovation positioning;
- dark brutalist style;
- neon style;
- fintech/crypto visual language;
- excessive 3D;
- fake text, fake logos, fake certificates or fake awards.

## Integration Checklist

- Save raw generated images in `assets/generated/`.
- Move selected source/reference assets to `assets/source/` only if they are meant to be edited or optimized.
- Optimize final web assets into `assets/optimized/`.
- Keep dimensions and crop targets documented near the consuming component.
- Verify image contrast under text if used in the hero.
- Do not use AI-generated readable text inside final page images unless it is verified.
- Do not use people images that imply real employees unless approved.

