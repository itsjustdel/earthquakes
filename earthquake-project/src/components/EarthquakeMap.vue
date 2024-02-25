<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup lang="ts">
import 'mapbox-gl/dist/mapbox-gl.css'
import { onMounted, ref, computed } from 'vue'
import mapboxgl from 'mapbox-gl'

import { useStore } from 'vuex'

mapboxgl.accessToken =
  'pk.eyJ1IjoiaXRzanVzdGRlbCIsImEiOiJjbHQwMGFsdGQwbzU5MmtvNjhmZXhiajQ2In0.B2xtzrPhHVHA5yBrm4vjVg'
const store = useStore()
const earthquakeData = computed<GeoJSON.FeatureCollection>(() => store.state.earthquakeData)
const loading = computed(() => store.state.loading)

const mapContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!mapContainer.value) return
  const map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-71.224518, 42.213995],
    zoom: 9
  })

  map.on('load', () => {
    map.addSource('earthquakes', {
      type: 'geojson',
      data: earthquakeData.value,
      generateId: true
    })
    map.addLayer({
      id: 'earthquakes-viz',
      type: 'circle',
      source: 'earthquakes',
      paint: {
        'circle-stroke-color': '#000',
        'circle-stroke-width': 1,
        'circle-color': '#000'
      }
    })
  })

  // Optionally, you can expose the map instance if needed
  // expose(map, 'map');
})
</script>

<style>
.map-container {
  flex: 1;
}
</style>
