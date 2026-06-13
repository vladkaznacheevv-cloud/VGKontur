export type ServiceAreaCity = {
  name: string;
  slug: string;
  coordinates: [number, number];
  primary?: boolean;
};

export const SERVICE_AREA_CITIES: ServiceAreaCity[] = [
  {
    name: "Ессентуки",
    slug: "essentuki",
    coordinates: [44.0445, 42.8606],
    primary: true
  },
  {
    name: "Кисловодск",
    slug: "kislovodsk",
    coordinates: [43.9052, 42.7168]
  },
  {
    name: "Железноводск",
    slug: "zheleznovodsk",
    coordinates: [44.1394, 43.0198]
  },
  {
    name: "Пятигорск",
    slug: "pyatigorsk",
    coordinates: [44.0393, 43.0708]
  }
];

export const SERVICE_AREA_CENTER = SERVICE_AREA_CITIES[0].coordinates;

// Центр и зум подобраны так, чтобы все четыре города КМВ попадали в кадр.
export const SERVICE_AREA_MAP_CENTER: [number, number] = [44.03, 42.92];
export const SERVICE_AREA_MAP_ZOOM = 10;
