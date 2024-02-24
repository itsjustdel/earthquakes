<template>
  <div>
    <h1>Data Fetching Example</h1>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import type { FeatureCollection } from '@/types/earthquake'

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
