# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: .tmp\qa-stage-4.spec.js >> Stage 4.1 QA >> forms surface validation messages
- Location: .tmp\qa-stage-4.spec.js:81:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#lead-form .form-status')
Expected substring: "Поле \"имя\" заполнено некорректно."
Received string:    "Укажите корректный телефон."
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#lead-form .form-status')
    14 × locator resolved to <p aria-live="polite" class="form-status is-error">Укажите корректный телефон.</p>
       - unexpected value "Укажите корректный телефон."

```

```yaml
- paragraph: Укажите корректный телефон.
```

# Test source

```ts
  1  | const { test, expect } = require("@playwright/test");
  2  | 
  3  | const viewports = [
  4  |   [360, 900],
  5  |   [390, 900],
  6  |   [430, 932],
  7  |   [768, 1024],
  8  |   [1280, 900],
  9  |   [1440, 960]
  10 | ];
  11 | 
  12 | test.describe("Stage 4.1 QA", () => {
  13 |   for (const [width, height] of viewports) {
  14 |     test(`no horizontal overflow at ${width}x${height}`, async ({ page }) => {
  15 |       const consoleMessages = [];
  16 |       page.on("console", (message) => {
  17 |         if (["error", "warning"].includes(message.type())) {
  18 |           consoleMessages.push(`${message.type()}: ${message.text()}`);
  19 |         }
  20 |       });
  21 | 
  22 |       await page.setViewportSize({ width, height });
  23 |       await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  24 | 
  25 |       const metrics = await page.evaluate(() => {
  26 |         const doc = document.documentElement;
  27 |         const offenders = Array.from(document.querySelectorAll("body *"))
  28 |           .map((element) => {
  29 |             const rect = element.getBoundingClientRect();
  30 |             return {
  31 |               tag: element.tagName.toLowerCase(),
  32 |               className: typeof element.className === "string" ? element.className : "",
  33 |               text: (element.textContent || "").trim().slice(0, 80),
  34 |               left: Math.round(rect.left),
  35 |               right: Math.round(rect.right),
  36 |               width: Math.round(rect.width)
  37 |             };
  38 |           })
  39 |           .filter((item) => item.right > doc.clientWidth + 1 || item.left < -1)
  40 |           .slice(0, 10);
  41 | 
  42 |         return {
  43 |           clientWidth: doc.clientWidth,
  44 |           scrollWidth: doc.scrollWidth,
  45 |           offenders
  46 |         };
  47 |       });
  48 | 
  49 |       expect(metrics.scrollWidth, JSON.stringify(metrics, null, 2)).toBeLessThanOrEqual(
  50 |         metrics.clientWidth + 1
  51 |       );
  52 |       expect(consoleMessages, consoleMessages.join("\n")).toEqual([]);
  53 |     });
  54 |   }
  55 | 
  56 |   test("lead API returns 503 without Telegram env", async ({ request }) => {
  57 |     const response = await request.post("http://localhost:3000/api/lead", {
  58 |       headers: {
  59 |         "x-forwarded-for": "203.0.113.77"
  60 |       },
  61 |       data: {
  62 |         kind: "lead",
  63 |         name: "Тест",
  64 |         phone: "+7 999 000-00-00",
  65 |         city: "Ессентуки",
  66 |         workType: "Ванная / санузел / плитка",
  67 |         comment: "QA без Telegram env",
  68 |         website: ""
  69 |       }
  70 |     });
  71 | 
  72 |     const body = await response.json();
  73 | 
  74 |     expect(response.status()).toBe(503);
  75 |     expect(body).toEqual({
  76 |       ok: false,
  77 |       message: "Отправка заявок ещё не настроена. Позвоните или напишите в WhatsApp."
  78 |     });
  79 |   });
  80 | 
  81 |   test("forms surface validation messages", async ({ page }) => {
  82 |     await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  83 | 
  84 |     await page.locator("#calculator button[type='submit']").click();
  85 |     await expect(page.locator("#calculator .form-status")).toContainText("Укажите корректный телефон.");
  86 | 
  87 |     await page.locator("#lead-form button[type='submit']").click();
> 88 |     await expect(page.locator("#lead-form .form-status")).toContainText('Поле "имя" заполнено некорректно.');
     |                                                           ^ Error: expect(locator).toContainText(expected) failed
  89 |   });
  90 | });
  91 | 
```