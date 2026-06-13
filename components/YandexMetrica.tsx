import Script from "next/script";

const RAW_COUNTER_ID = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;

function resolveCounterId(): string | null {
  if (!RAW_COUNTER_ID) {
    return null;
  }

  const trimmed = RAW_COUNTER_ID.trim();

  // Подключаем счётчик только для валидного числового id, чтобы
  // плейсхолдеры из .env.example никогда не попадали в разметку.
  if (!/^\d{4,12}$/.test(trimmed)) {
    return null;
  }

  return trimmed;
}

export function YandexMetrica() {
  const counterId = resolveCounterId();

  if (!counterId) {
    return null;
  }

  return (
    <>
      <Script id="yandex-metrica" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(${counterId}, "init", {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true
          });
        `}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${counterId}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
