export interface MeldungData {
  title: string
  category: string
  subcategory: string
  description: string
  examples: string
  rating: string
}

export interface MeldungPoint {
  id: string
  longitude: number
  latitude: number
  data?: MeldungData
} 