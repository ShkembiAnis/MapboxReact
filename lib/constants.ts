export const MAPBOX_TOKEN = "pk.eyJ1IjoiYW5vamEiLCJhIjoiY203ZXplcTl1MGhqYTJrcjB4N2duOWNmNCJ9.9zUulGIaw0X8lAFidfeWNg"

export const CATEGORIES = [
  "Zu Fuß",
  "Fahrrad",
  "Auto",
  "ÖPNV"
] as const

export const SUBCATEGORIES = [
  "Baustelle",
  "Schlagloch",
  "Beleuchtung",
  "Sicherheit",
  "Absperrung",
  "Gehweg"
] as const

export const DEFAULT_MAP_CENTER: [number, number] = [-97.7431, 30.2672] // Austin, TX
export const DEFAULT_MAP_ZOOM = 10 