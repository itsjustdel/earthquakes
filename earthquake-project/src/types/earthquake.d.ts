interface Geometry {
  type: string
  coordinates: [number, number, number]
}

interface Properties {
  mag: number
  place: string
  time: number
  updated: number
  // Add more properties as needed
}

interface Feature {
  type: string
  properties: Properties
  geometry: Geometry
  id: string
}

export interface FeatureCollection {
  type: string
  metadata: {
    generated: number
    url: string
    title: string
    api: string
    count: number
    status: number
  }
  bbox: [number, number, number, number, number, number]
  features: Feature[]
}
