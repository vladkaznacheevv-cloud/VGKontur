"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import facade01 from "@/assets/optimized/works/facade-01.webp";
import facade02 from "@/assets/optimized/works/facade-02.webp";
import facade03 from "@/assets/optimized/works/facade-03.webp";
import facade04 from "@/assets/optimized/works/facade-04.webp";
import finishing01 from "@/assets/optimized/works/finishing-01.webp";
import finishing02 from "@/assets/optimized/works/finishing-02.webp";
import finishing03 from "@/assets/optimized/works/finishing-03.webp";
import finishing04 from "@/assets/optimized/works/finishing-04.webp";
import finishing05 from "@/assets/optimized/works/finishing-05.webp";
import finishing06 from "@/assets/optimized/works/finishing-06.webp";
import finishing07 from "@/assets/optimized/works/finishing-07.webp";
import finishing08 from "@/assets/optimized/works/finishing-08.webp";
import houses01 from "@/assets/optimized/works/houses-01.webp";
import houses02 from "@/assets/optimized/works/houses-02.webp";
import houses03 from "@/assets/optimized/works/houses-03.webp";
import houses04 from "@/assets/optimized/works/houses-04.webp";
import houses05 from "@/assets/optimized/works/houses-05.webp";
import houses06 from "@/assets/optimized/works/houses-06.webp";
import industrial01 from "@/assets/optimized/works/industrial-01.webp";
import industrial02 from "@/assets/optimized/works/industrial-02.webp";
import industrial03 from "@/assets/optimized/works/industrial-03.webp";
import industrial04 from "@/assets/optimized/works/industrial-04.webp";
import industrial05 from "@/assets/optimized/works/industrial-05.webp";
import industrial06 from "@/assets/optimized/works/industrial-06.webp";
import landscape01 from "@/assets/optimized/works/landscape-01.webp";
import landscape02 from "@/assets/optimized/works/landscape-02.webp";
import landscape03 from "@/assets/optimized/works/landscape-03.webp";

type Photo = {
  image: StaticImageData;
  alt: string;
};

type WorkCategory = {
  id: string;
  label: string;
  photos: Photo[];
};

// Нейтральные подписи направлений. Внутри направления пользователь листает
// фотографии работ, без повторяющихся описаний и без точных адресов объектов.
const CATEGORIES: WorkCategory[] = [
  {
    id: "finishing",
    label: "Внутренняя отделка",
    photos: [
      { image: finishing01, alt: "Кухня после внутренней отделки с обеденной зоной" },
      { image: finishing02, alt: "Светлая комната после отделки с панорамными окнами и паркетом" },
      { image: finishing03, alt: "Кухня после отделки с плиточным фартуком и подсветкой" },
      { image: finishing04, alt: "Кухня после отделки со светильником и окном" },
      { image: finishing05, alt: "Стена с декоративной рельефной панелью и подсветкой потолка" },
      { image: finishing06, alt: "Коридор после отделки с межкомнатными дверями и подсветкой" },
      { image: finishing07, alt: "Санузел после отделки с зеркалом с подсветкой" },
      { image: finishing08, alt: "Комната после отделки с паркетом «ёлочкой» и окном" }
    ]
  },
  {
    id: "houses",
    label: "Строительство домов",
    photos: [
      { image: houses01, alt: "Готовый частный дом с террасой после строительства" },
      { image: houses02, alt: "Коробка дома из газобетона на этапе строительства" },
      { image: houses03, alt: "Частный дом из газобетона с готовым ограждением" },
      { image: houses04, alt: "Стены дома из газобетона и монтаж стропил крыши" },
      { image: houses05, alt: "Залитый фундамент частного дома" },
      { image: houses06, alt: "Деревянные стропильные фермы крыши дома" }
    ]
  },
  {
    id: "facade",
    label: "Фасадные работы",
    photos: [
      { image: facade01, alt: "Окраска и декоративное оформление фасада здания" },
      { image: facade02, alt: "Фасад здания с декоративным рисунком и наружной лестницей" },
      { image: facade03, alt: "Окрашенный фасад здания, общий вид" },
      { image: facade04, alt: "Фрагмент окрашенного фасада с декоративным оформлением" }
    ]
  },
  {
    id: "landscape",
    label: "Ландшафтные работы",
    photos: [
      { image: landscape01, alt: "Благоустройство: круглая мощёная площадка с зоной отдыха" },
      { image: landscape02, alt: "Мощение площадки и бетонные элементы зоны отдыха" },
      { image: landscape03, alt: "Обустройство круглой площадки с мощением" }
    ]
  },
  {
    id: "industrial",
    label: "Промышленное строительство",
    photos: [
      { image: industrial01, alt: "Производственное здание с металлической облицовкой и воротами" },
      { image: industrial02, alt: "Быстровозводимое производственное здание" },
      { image: industrial03, alt: "Протяжённое производственное здание с воротами" },
      { image: industrial04, alt: "Производственный корпус с металлической облицовкой" },
      { image: industrial05, alt: "Монтаж металлического каркаса производственного здания" },
      { image: industrial06, alt: "Возведение металлического каркаса здания с автокраном" }
    ]
  }
];

export function WorksGallery() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const category = activeCategory !== null ? CATEGORIES[activeCategory] : null;
  const photo = category ? category.photos[photoIndex] : null;

  const closeLightbox = useCallback(() => setActiveCategory(null), []);

  const openCategory = useCallback((index: number) => {
    setActiveCategory(index);
    setPhotoIndex(0);
  }, []);

  const step = useCallback(
    (offset: number) => {
      setPhotoIndex((current) => {
        if (activeCategory === null) {
          return current;
        }
        const total = CATEGORIES[activeCategory].photos.length;
        return (current + offset + total) % total;
      });
    },
    [activeCategory]
  );

  useEffect(() => {
    if (activeCategory === null) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowRight") {
        step(1);
      } else if (event.key === "ArrowLeft") {
        step(-1);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeCategory, closeLightbox, step]);

  return (
    <div className="works-gallery">
      <ul className="works-cats">
        {CATEGORIES.map((cat, index) => (
          <li key={cat.id}>
            <button
              className="work-cat-card"
              type="button"
              onClick={() => openCategory(index)}
              aria-label={`Открыть фотогалерею: ${cat.label}, ${cat.photos.length} фото`}
            >
              <Image
                src={cat.photos[0].image}
                alt={cat.photos[0].alt}
                width={cat.photos[0].image.width}
                height={cat.photos[0].image.height}
                sizes="(min-width: 980px) 31vw, (min-width: 700px) 48vw, 100vw"
                placeholder="blur"
              />
              <span className="work-cat-overlay">
                <strong>{cat.label}</strong>
                <span className="work-cat-meta">
                  <Images size={16} aria-hidden="true" />
                  {cat.photos.length} фото
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {category && photo ? (
        <div
          className="works-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Фотографии работ: ${category.label}`}
          onClick={closeLightbox}
        >
          <div className="works-lightbox-inner" onClick={(event) => event.stopPropagation()}>
            <button
              className="works-lightbox-close"
              type="button"
              onClick={closeLightbox}
              ref={closeButtonRef}
              aria-label="Закрыть просмотр фото"
            >
              <X size={20} aria-hidden="true" />
            </button>

            <div className="works-lightbox-frame">
              <Image
                src={photo.image}
                alt={photo.alt}
                width={photo.image.width}
                height={photo.image.height}
                sizes="(min-width: 980px) 70vw, 100vw"
                placeholder="blur"
              />
            </div>

            <div className="works-lightbox-bar">
              <div className="works-lightbox-caption">
                <span className="work-photo-tag">{category.label}</span>
                {category.photos.length > 1 ? (
                  <span className="works-lightbox-count" aria-live="polite">
                    {photoIndex + 1} / {category.photos.length}
                  </span>
                ) : null}
              </div>

              {category.photos.length > 1 ? (
                <div className="works-lightbox-nav">
                  <button type="button" onClick={() => step(-1)} aria-label="Предыдущее фото">
                    <ChevronLeft size={20} aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label="Следующее фото">
                    <ChevronRight size={20} aria-hidden="true" />
                  </button>
                </div>
              ) : null}
            </div>

            <a className="button button-primary works-lightbox-cta" href="#lead-form" onClick={closeLightbox}>
              <span>Обсудить похожую задачу</span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
