<template>
  <div>
    <h1>Data Fetching Example</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <ul>
        <li v-for="(quake, index) in earthquakeData.features" :key="index">
          <span
            @mouseover="handleMouseOver(quake)"
            @mouseout="handleMouseOut(quake)"
            @click="handleClick(quake)"
            :style="{ cursor: 'pointer' }"
          >
            {{ quake.properties ? quake.properties.place : '' }} - Magnitude:
            {{ quake.properties ? quake.properties.mag : '' }}
          </span>
          <button @click="zoomToCoordinates(quake.geometry)">Zoom to Coordinates</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import type { Geometry, Point, Feature } from 'geojson'

const store = useStore()
const zoomToCoordinates = (event: Geometry) => {
  const map = store.state.map

  if (event.type !== 'Point') return
  const pointEvent = event as Point

  if (map) {
    const clickedPoint = { lng: pointEvent.coordinates[0], lat: pointEvent.coordinates[1] }

    // Use easeTo to smoothly transition to the clicked point
    map.flyTo({
      center: clickedPoint,
      duration: 5000, // Animation duration in milliseconds
      zoom: 7 // Optional: Zoom in slightly for better visibility
    })
  }
}

const earthquakeData = computed<GeoJSON.FeatureCollection>(() => store.state.earthquakeData)
const loading = computed(() => store.state.loading)

const handleMouseOver = (quake: GeoJSON.Feature) => {
  const map = store.state.map
  // Handle mouse over logic similar to the map
  if (quake.id) {
    // store.commit('setHoveredFeature', quakeID)
    console.log('mouse over', quake.id)
    map.setFeatureState(
      {
        source: 'earthquakes',
        id: quake.id
      },
      {
        hover: true
      }
    )
  }
}

const handleMouseOut = (quake: Feature) => {
  // Handle mouse out logic similar to the map
  if (quake.id) {
    // store.commit('setHoveredFeature', null)
  }
}

const handleClick = (quake: GeoJSON.Feature) => {
  // Handle click logic similar to the map
  // You can access the clicked earthquake's data through the quake parameter
  console.log('Clicked earthquake:', quake)
  // Add your logic to zoom or perform other actions as needed
}

onMounted(() => {
  store.dispatch('fetchData')
})
</script>
