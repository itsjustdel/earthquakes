<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup lang="ts">
import 'mapbox-gl/dist/mapbox-gl.css'
import { onMounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken =
  'pk.eyJ1IjoiaXRzanVzdGRlbCIsImEiOiJjbHQwMGFsdGQwbzU5MmtvNjhmZXhiajQ2In0.B2xtzrPhHVHA5yBrm4vjVg'

const mapContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!mapContainer.value) return
  const map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v12', // Replace with your preferred map style
    center: [-71.224518, 42.213995],
    zoom: 9
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
