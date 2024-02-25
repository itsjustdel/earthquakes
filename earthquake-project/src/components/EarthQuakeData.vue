<template>
  <div>
    <h1>Data Fetching Example</h1>
    <input type="text" v-model="searchQuery" placeholder="Search earthquakes..." />
    <div v-if="loading">Loading...</div>
    <div v-else>
      <ul>
        <li
          v-for="(quake, index) in filteredEarthquakes"
          :key="index"
          @mouseover="handleMouseOver(index)"
          @mouseout="handleMouseOut(index)"
          @click="handleClick(quake.geometry)"
        >
          <span>
            {{ quake.properties ? quake.properties.place : '' }} - Magnitude:
            {{ quake.properties ? quake.properties.mag : '' }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import type { Geometry, Point } from 'geojson'

const store = useStore()

const loading = computed(() => store.state.loading)
const earthquakeData = computed<GeoJSON.FeatureCollection>(() => store.state.earthquakeData)
const filteredEarthquakes = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return earthquakeData.value.features.filter((quake) =>
    quake.properties?.place.toLowerCase().includes(query)
  )
})

const searchQuery = ref<string>('')

onMounted(() => {
  store.dispatch('fetchData')
})

const handleClick = (event: Geometry) => {
  if (event.type !== 'Point') return
  const map = computed(() => store.state.map)
  const pointEvent = event as Point

  if (map.value) {
    const clickedPoint = { lng: pointEvent.coordinates[0], lat: pointEvent.coordinates[1] }
    map.value.flyTo({
      center: clickedPoint,
      duration: 5000,
      zoom: 7
    })
  }
}

const handleMouseOver = (index: number) => {
  const map = computed(() => store.state.map)
  if (!map.value) return
  map.value.setFeatureState(
    {
      source: 'earthquakes',
      id: index
    },
    {
      hover: true
    }
  )
  // Modify the cursor style for the entire app
  document.body.style.cursor = 'pointer'
}

const handleMouseOut = (index: number) => {
  const map = computed(() => store.state.map)
  if (!map.value) return
  map.value.setFeatureState(
    {
      source: 'earthquakes',
      id: index
    },
    {
      hover: false
    }
  )
  document.body.style.cursor = ''
}
</script>
