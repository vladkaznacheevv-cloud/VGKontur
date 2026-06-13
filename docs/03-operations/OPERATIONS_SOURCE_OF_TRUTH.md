# Operations Source Of Truth

## Launch Decision

CRM is not used at launch.

Leads must go to a Telegram group where the project owner and partner are present.

Basic flow:

> Site -> form -> Telegram group -> manual processing

The site may also show direct contacts:

- phone;
- WhatsApp;
- Telegram public contact: `@VGKontur`;
- Telegram public link: `https://t.me/VGKontur`.

Launch Telegram setup:

- Telegram group for site leads is created.
- Telegram bot for site leads is created.
- Real bot token, chat id, invite links and private operational details must stay outside repository files, docs, logs and screenshots.

## Lead Form Fields

Minimum fields:

- имя;
- телефон;
- город;
- тип работ;
- комментарий.

Keep the form short to protect conversion.

## Roles

| Responsibility | Owner |
|---|---|
| Reply to call/lead | Owner or partner |
| Measurement visit | Owner |
| Estimate calculation | Owner |
| Price agreement | Partner |
| Crew selection | Partner |
| Object control | Owner |
| Warranty/conflict handling | Owner and partner together |

## Minimal Lead Statuses

Use these statuses in Telegram messages or a later spreadsheet/CRM:

- новая заявка;
- связались;
- назначен замер;
- смета в работе;
- смета отправлена;
- согласование цены;
- договор;
- отказ;
- мусор.

Optional operational statuses from the Stage 3 source may also be used:

- замер проведён;
- цена согласована;
- в работе.

## Processing Scenario

1. Client submits a form or contacts directly.
2. Lead appears in the Telegram group.
3. Owner or partner contacts the client.
4. They clarify city, object, work type, area, urgency, budget expectations and measurement readiness.
5. If qualified, owner schedules and performs measurement.
6. Owner prepares preliminary estimate.
7. Partner agrees price with the client.
8. Partner selects crew.
9. Owner controls quality, stages and agreements.
10. Owner and partner handle warranty/conflicts together.

## Risks Without CRM

| Risk | Mitigation |
|---|---|
| Lead lost in Telegram | Every lead must receive a status |
| Unclear responsible person | Each lead message should mention owner/responsible person |
| No ad analytics | Use UTM tags and Yandex Metrica goals |
| Unclear contract economics | Keep a simple manual sheet if lead volume grows |
| Confused deal stages | Use the minimal status list consistently |

## Security

- Do not store Telegram bot token in repository files.
- Do not store real Telegram chat id in repository files.
- Do not publish invite links in docs, code or logs.
- Keep public Telegram contact as `@VGKontur` / `https://t.me/VGKontur`.
- Do not log client PII.
- Use environment variables and safe `.env.example` placeholders.
