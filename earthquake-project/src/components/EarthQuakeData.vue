<template>
  <div class="quake-container">
    <h1>Earthquakes</h1>

    <div v-if="loading">Loading...</div>
    <div v-else class="quake-list">
      <input
        class="search-box"
        type="text"
        v-model="searchQuery"
        placeholder="Search earthquakes..."
      />

      <div
        class="list-item"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import type { Geometry, Point } from 'geojson'

const store = useStore()
const searchQuery = ref<string>('')

const earthquakeData = computed<GeoJSON.FeatureCollection>(() => store.state.earthquakeData)
const loading = computed(() => store.state.loading)
const map = computed(() => store.state.map)
const filteredEarthquakes = computed(() => {
  const query = searchQuery.value.toLowerCase()
  if (query === '') return earthquakeData.value.features

  return earthquakeData.value.features.filter((quake) =>
    quake.properties?.place.toLowerCase().includes(query)
  )
})

onMounted(() => {
  store.dispatch('fetchData')
})

watch(filteredEarthquakes, () => {
  if (!map.value) return

  const filteredIds = filteredEarthquakes.value.map((f) => {
    return earthquakeData.value.features.indexOf(f)
  })

  map.value.setFilter('earthquakes-viz', ['in', '$id', ...filteredIds])
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
  if (!map.value) return

  console.log(earthquakeData.value)
  console.log(filteredEarthquakes.value[index])
  const initialIndex = earthquakeData.value.features.findIndex(
    (f) => filteredEarthquakes.value[index].id === f.id
  )

  console.log('init index', initialIndex)
  map.value.setFeatureState(
    {
      source: 'earthquakes',
      id: initialIndex
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
  const initialIndex = earthquakeData.value.features.findIndex(
    (f) => filteredEarthquakes.value[index].id === f.id
  )
  map.value.setFeatureState(
    {
      source: 'earthquakes',
      id: initialIndex
    },
    {
      hover: false
    }
  )
  document.body.style.cursor = ''
}
</script>

<style scoped>
.quake-container {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 40px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  min-width: 410px;
  z-index: 1000;
  background-color: #000000cc;
  display: flex;
  flex-direction: column;
  gap: 1em;
  border: 1px solid #ffffff66;
  border-radius: 4px;
}

.quake-list {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.search-box {
  color: #ebebeba3;
  background-color: #00000066;
  padding: 8px;
  border: 1px solid #ffffff66;
  border-radius: 4px;
  outline: none;
  width: 200px;
}

.list-item {
  padding: 5px;
  transition: background-color 0.3s ease;
}

.list-item:hover {
  background-color: #00000066;
}
</style>
