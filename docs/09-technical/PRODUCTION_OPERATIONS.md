# Production Operations — VG Контур

Эксплуатационная памятка по боевому сайту. **Без секретов.** Реальные токены,
chat_id, invite-ссылки и PII здесь не хранятся — только имена переменных и схемы.

> Перед изменением текста/структуры/цен — сверяться с source-of-truth (`docs/README.md`).

## Домен и схема

- Боевой сайт: **https://vgkontur.ru**.
- Технологическая схема запроса:

  ```
  Браузер → HTTPS → Nginx (reverse proxy, TLS, заголовки) → PM2 (Next.js, node) → Next.js (app)
  ```

  - **Nginx** терминирует HTTPS, редиректит HTTP→HTTPS и (при необходимости) www→apex, добавляет security-заголовки, проксирует на локальный порт Next.js.
  - **PM2** держит процесс Next.js живым (автоперезапуск, логи, старт после reboot).
  - **Next.js** обслуживает лендинг и API `/api/lead`.

## Где что лежит на VPS

- Путь проекта: **`/var/www/vgkontur`**.
- PM2 process name: **`vgkontur`**.
- Хранилище заявок: **`/var/lib/vgkontur/leads.ndjson`** (вне каталога проекта и вне git).
- Боевые env — только в окружении деплоя / локальном ignored-файле, **не в git**.

## Команды (build / restart / status)

Выполнять из `/var/www/vgkontur`:

```bash
# Обновление и сборка
git pull                     # если деплой через git
npm ci                       # установка зависимостей по lock-файлу
npm run build                # прод-сборка Next.js
npm run typecheck            # быстрая проверка типов (без emit)

# PM2
pm2 restart vgkontur         # перезапуск после сборки
pm2 reload vgkontur          # zero-downtime reload (если cluster mode)
pm2 status vgkontur          # статус процесса
pm2 logs vgkontur --lines 100   # логи (НЕ содержат PII/payload — только безопасные маркеры)
pm2 save                     # зафиксировать список процессов для автозапуска

# Nginx
sudo nginx -t                # проверить конфиг
sudo systemctl reload nginx  # применить конфиг без даунтайма
```

> Первый запуск процесса (один раз): `pm2 start npm --name vgkontur -- start` из каталога
> проекта, затем `pm2 save`. Дальше — только `restart`/`reload`.

## Переменные окружения (имена, без значений)

Боевые значения задаются только в окружении сервера. В репозитории — только плейсхолдеры в `.env.example`.

| Переменная | Назначение | Тип |
| --- | --- | --- |
| `TELEGRAM_BOT_TOKEN` | токен бота для отправки заявок | server-side, секрет |
| `TELEGRAM_CHAT_ID` | id группы, куда падают заявки | server-side, секрет |
| `LEADS_STORAGE_PATH` | путь к NDJSON-хранилищу заявок | server-side |
| `NEXT_PUBLIC_YANDEX_METRICA_ID` | id счётчика Яндекс.Метрики | публичная |
| `NEXT_PUBLIC_YANDEX_MAPS_API_KEY` | ключ Яндекс.Карт (есть styled-fallback) | публичная |
| `NEXT_PUBLIC_TELEGRAM_URL` | публичная ссылка на Telegram-контакт | публичная |

На проде ожидается `LEADS_STORAGE_PATH=/var/lib/vgkontur/leads.ndjson`.

## Хранилище заявок (lead storage)

- Путь: `/var/lib/vgkontur/leads.ndjson` (через `LEADS_STORAGE_PATH`).
- Формат: **append-only NDJSON**, одна JSON-строка на событие (источник истины — `lib/leadStorage.ts`):
  - основная запись: `type = "lead" | "estimate"`, создаётся **до** отправки в Telegram, `telegramDeliveryStatus: "pending"`;
  - статус доставки: `type = "status"` (связь по `id`) → `"sent"` или `"failed"`.
- Смысл: заявка не теряется при временном сбое Telegram/API. `pending` без последующего
  `status` = заявка сохранена, но доставка в Telegram не подтверждена.
- Файл содержит **PII** (имя, телефон) → вне git, не в логи, не в открытые каналы.

### Безопасные скрипты обслуживания

Чистый Node, без новых зависимостей. Путь берётся из `LEADS_STORAGE_PATH`, иначе fallback
`./storage/leads.ndjson`. Скрипты **не читают `.env`-файлы** и **не печатают** токены/chat_id;
телефон и имя в `summary`/`tail` всегда маскируются.

```bash
# На проде путь к хранилищу передаётся через окружение:
LEADS_STORAGE_PATH=/var/lib/vgkontur/leads.ndjson npm run leads:summary
LEADS_STORAGE_PATH=/var/lib/vgkontur/leads.ndjson npm run leads:tail -- 20
LEADS_STORAGE_PATH=/var/lib/vgkontur/leads.ndjson npm run leads:backup
LEADS_STORAGE_PATH=/var/lib/vgkontur/leads.ndjson npm run leads:export -- --mask
```

| Скрипт | Что делает | PII |
| --- | --- | --- |
| `leads:summary` | сводка: всего событий, заявок, по типам (lead/estimate) и статусам (pending/sent/failed) | без PII |
| `leads:tail -- N` | последние N заявок; имя → `И***`, телефон → последние 2 цифры | маскировано |
| `leads:backup` | копия хранилища с timestamp в `<dir>/backups/` | файл с PII, вне git |
| `leads:export -- [--mask] [--out <path>]` | CSV-экспорт; защита от CSV-инъекций; по умолчанию полный (с PII), `--mask` — безопасная версия | контролируемо |

- Бэкапы и экспорты по умолчанию пишутся рядом с хранилищем (на проде — `/var/lib/vgkontur/...`,
  локально — `storage/`, который закрыт `.gitignore`).
- `leads:export` без `--mask` создаёт файл с реальными ПДн — для офлайн-обзвона; не коммитить и не пересылать в открытых каналах.

## Аналитика (Яндекс.Метрика)

- Counter ID: **`110037967`** (подключается через `NEXT_PUBLIC_YANDEX_METRICA_ID`,
  компонент `components/YandexMetrica.tsx`; цели — `lib/metricaGoals.ts`).
- Цели (goal IDs):
  - `phone_click`
  - `whatsapp_click`
  - `telegram_click`
  - `form_submit`
  - `calculator_submit`

## Оператор персональных данных (юридическое)

Публичные регистрационные данные оператора ПДн (не секрет, не PII клиентов) — единый
источник в коде `lib/contacts.ts` (`PERSONAL_DATA_OPERATOR`), отображаются на `/privacy`:

- Оператор: Индивидуальный предприниматель Казначеев Владислав Сергеевич.
- ИНН: `262610640023`; ОГРНИП: `324265100007638`.
- Регион деятельности: Ставропольский край, г. Ессентуки.
- Email для обращений по ПДн: `vlad.kaznacheevv@gmail.com`; телефон: `+7 (962) 003-35-74`.
- Ответственный за обработку ПДн: Казначеев Владислав Сергеевич.
- Срок хранения заявок: 1 месяц с даты последнего обращения пользователя либо до отзыва согласия.

Текст согласия под формами (lead и calculator): «Нажимая кнопку, вы соглашаетесь
с обработкой персональных данных и Политикой конфиденциальности.» — ссылка ведёт на `/privacy`.

**Осталось вне кода перед масштабным рекламным трафиком:** проверить необходимость
уведомления Роскомнадзора / включения в реестр операторов ПДн.

## Безопасность (состояние и где обеспечивается)

| Контроль | Где | Статус / как проверить |
| --- | --- | --- |
| HTTPS / TLS | Nginx | сертификат активен на `https://vgkontur.ru`; проверить срок и авто-renew |
| Редиректы HTTP→HTTPS (и www→apex) | Nginx | `curl -I http://vgkontur.ru` → 301 на https |
| Security-заголовки / HSTS | Nginx | `curl -I https://vgkontur.ru` → `Strict-Transport-Security` и пр. |
| Файрвол UFW | ОС | `sudo ufw status` → открыты только 22/80/443 |
| fail2ban | ОС | `sudo fail2ban-client status` → активные jail'ы (sshd и т.п.) |
| Rate-limit `/api/lead` | **код приложения** | `app/api/lead/route.ts`: 5 запросов / 10 мин на IP (in-memory) + honeypot |
| Валидация/санитайз форм | код приложения | `lib/leadValidation.ts` (нормализация, лимиты длины, проверка опций) |
| Безопасные тексты ошибок | код приложения | `/api/lead` не отдаёт наружу сетевые/системные детали |
| Отсутствие PII в логах | код приложения | `lib/leadStorage.ts` пишет только безопасные маркеры + код ошибки |

> Серверные пункты (Nginx/UFW/fail2ban/TLS) задаются на VPS и не отражены в репозитории —
> проверять командами выше. Rate-limit и валидация enforced в коде приложения.

## Что нельзя коммитить (никогда)

- `.env`, `.env.local`, `.env.production`, `.env.production.local` и любые `.env.*`
  (кроме `.env.example` с плейсхолдерами);
- `leads.ndjson`, каталог `storage/`, бэкапы (`*.bak`) и CSV-экспорты заявок;
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, любые токены и ключи;
- invite-ссылки на Telegram-группу, приватные контакты;
- любые ПДн клиентов (имена, телефоны, тексты заявок).

`.gitignore` закрывает `.env`/`.env.*` (кроме `.env.example`) и `/storage/`. Боевые секреты —
только в окружении деплоя.
