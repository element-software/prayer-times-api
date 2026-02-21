export interface City {
  name: string;
  latitude: number;
  longitude: number;
}

export const UK_CITIES: Record<string, City> = {
  london: { name: "London", latitude: 51.5074, longitude: -0.1278 },
  birmingham: { name: "Birmingham", latitude: 52.4862, longitude: -1.8904 },
  manchester: { name: "Manchester", latitude: 53.4808, longitude: -2.2426 },
  leicester: { name: "Leicester", latitude: 52.6369, longitude: -1.1398 },
  bradford: { name: "Bradford", latitude: 53.795, longitude: -1.7594 },
  glasgow: { name: "Glasgow", latitude: 55.8642, longitude: -4.2518 },
  leeds: { name: "Leeds", latitude: 53.8008, longitude: -1.5491 },
  liverpool: { name: "Liverpool", latitude: 53.4084, longitude: -2.9916 },
  sheffield: { name: "Sheffield", latitude: 53.3811, longitude: -1.4701 },
};

export function getCityByName(name: string): City | undefined {
  return UK_CITIES[name.toLowerCase()];
}
