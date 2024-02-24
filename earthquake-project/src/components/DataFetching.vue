<template>
  <div>
    <h1>Data Fetching Example</h1>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Geometry {
  type: string
  coordinates: [number, number, number]
}

interface Properties {
  mag: number
  place: string
  time: number
  updated: number
}

interface Feature {
  type: string
  properties: Properties
  geometry: Geometry
  id: string
}

interface FeatureCollection {
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

const earthquakeData = ref<FeatureCollection[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await axios.get<FeatureCollection[]>(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'
    )
    earthquakeData.value = response.data
    console.log('Fetched data:', response.data)
    console.log('stored value:', earthquakeData.value)
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
})
</script>
