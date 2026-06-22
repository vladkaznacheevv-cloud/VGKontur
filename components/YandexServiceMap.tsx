"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import Image from "next/image";
import contactsFallbackImage from "@/assets/optimized/contacts-kmv-fallback-v01.webp";
import {
  SERVICE_AREA_CITIES,
  SERVICE_AREA_MAP_CENTER,
  SERVICE_AREA_MAP_ZOOM
} from "@/lib/serviceArea";

type YandexServiceMapProps = {
  apiKey?: string;
};

declare global {
  interface Window {
    ymaps?: {
      ready: (callback: () => void) => void;
      Map: new (
        element: HTMLElement,
        options: {
          center: [number, number];
          zoom: number;
          controls?: string[];
        }
      ) => {
        geoObjects: {
          add: (placemark: unknown) => void;
        };
        destroy: () => void;
      };
      Placemark: new (
        coordinates: [number, number],
        properties: { balloonContent: string; hintContent: string },
        options: { preset: string; iconColor: string }
      ) => unknown;
    };
  }
}

function FallbackMap() {
  return (
    <div className="map-panel" aria-label="Зона работы по городам КМВ">
      <Image
        className="map-panel-image"
        src={contactsFallbackImage}
        alt=""
        width={contactsFallbackImage.width}
        height={contactsFallbackImage.height}
        sizes="(min-width: 980px) 58vw, 100vw"
        loading="lazy"
        aria-hidden="true"
      />
      <span className="map-ring map-ring-main" />
      <span className="map-ring map-ring-secondary" />
      <span className="map-line map-line-a" />
      <span className="map-line map-line-b" />
      {SERVICE_AREA_CITIES.map((city) => (
        <div
          className={city.primary ? "map-pin map-pin-main" : `map-pin map-pin-${city.slug}`}
          key={city.name}
        >
          {city.primary ? <MapPin size={18} aria-hidden="true" /> : null}
          {city.name}
        </div>
      ))}
      <p className="map-fallback-note">
        Базируемся в Ессентуках и выезжаем на замер по всем городам Кавминвод.
      </p>
    </div>
  );
}

export function YandexServiceMap({ apiKey }: YandexServiceMapProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<{ destroy: () => void } | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [hasMapError, setHasMapError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Не грузим тяжёлый Яндекс.Карты API на первом экране: подключаем скрипт
  // только когда блок контактов приближается к вьюпорту. До этого виден
  // styled-fallback. Так карта не конкурирует за трафик/CPU при первой отрисовке.
  useEffect(() => {
    if (!apiKey) {
      return;
    }

    const node = wrapRef.current;
    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [apiKey]);

  useEffect(() => {
    if (!apiKey || !shouldLoad || !mapRef.current) {
      return;
    }

    const scriptId = "yandex-maps-api";
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    function initMap() {
      if (!window.ymaps || !mapRef.current || mapInstanceRef.current) {
        return;
      }

      window.ymaps.ready(() => {
        if (!window.ymaps || !mapRef.current || mapInstanceRef.current) {
          return;
        }

        const map = new window.ymaps.Map(mapRef.current, {
          center: SERVICE_AREA_MAP_CENTER,
          zoom: SERVICE_AREA_MAP_ZOOM,
          controls: ["zoomControl"]
        });

        SERVICE_AREA_CITIES.forEach((city) => {
          const placemark = new window.ymaps!.Placemark(
            city.coordinates,
            {
              balloonContent: city.primary
                ? `${city.name} — наш базовый город: ремонт и отделка, бесплатный выезд на замер`
                : `${city.name} — выезжаем на замер и выполняем работы`,
              hintContent: city.name
            },
            {
              preset: city.primary ? "islands#greenDotIcon" : "islands#blueDotIcon",
              iconColor: city.primary ? "#3f6f4a" : "#35537a"
            }
          );

          map.geoObjects.add(placemark);
        });

        mapInstanceRef.current = map;
        setIsMapReady(true);
      });
    }

    if (existingScript) {
      if (window.ymaps) {
        initMap();
      } else {
        existingScript.addEventListener("load", initMap, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`;
    script.async = true;
    script.onload = initMap;
    script.onerror = () => setHasMapError(true);
    document.head.appendChild(script);

    return () => {
      mapInstanceRef.current?.destroy();
      mapInstanceRef.current = null;
    };
  }, [apiKey, shouldLoad]);

  if (!apiKey || hasMapError) {
    return <FallbackMap />;
  }

  return (
    <div className="yandex-map-wrap" ref={wrapRef}>
      {!isMapReady ? <FallbackMap /> : null}
      <div
        className="yandex-map"
        ref={mapRef}
        aria-label="Яндекс.Карта зоны работ VG Контур по городам КМВ"
      />
    </div>
  );
}
