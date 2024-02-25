<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup lang="ts">
import 'mapbox-gl/dist/mapbox-gl.css'
import { onMounted, ref, computed, watch } from 'vue'
import mapboxgl from 'mapbox-gl'

import { useStore } from 'vuex'

mapboxgl.accessToken =
  'pk.eyJ1IjoiaXRzanVzdGRlbCIsImEiOiJjbHQwMGFsdGQwbzU5MmtvNjhmZXhiajQ2In0.B2xtzrPhHVHA5yBrm4vjVg'
const store = useStore()
const earthquakeData = computed<GeoJSON.FeatureCollection>(() => store.state.earthquakeData)
const loading = computed(() => store.state.loading)

const mapContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  watch(loading, () => {
    if (!mapContainer.value || loading.value) {
      return
    }
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
          // The feature-state dependent circle-radius expression will render
          // the radius size according to its magnitude when
          // a feature's hover state is set to true
          'circle-radius': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            [
              'interpolate',
              ['linear'],
              ['get', 'mag'],
              1,
              8,
              1.5,
              10,
              2,
              12,
              2.5,
              14,
              3,
              16,
              3.5,
              18,
              4.5,
              20,
              6.5,
              22,
              8.5,
              24,
              10.5,
              26
            ],
            5
          ],
          'circle-stroke-color': '#000',
          'circle-stroke-width': 1,
          // The feature-state dependent circle-color expression will render
          // the color according to its magnitude when
          // a feature's hover state is set to true
          'circle-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            [
              'interpolate',
              ['linear'],
              ['get', 'mag'],
              1,
              '#fff7ec',
              1.5,
              '#fee8c8',
              2,
              '#fdd49e',
              2.5,
              '#fdbb84',
              3,
              '#fc8d59',
              3.5,
              '#ef6548',
              4.5,
              '#d7301f',
              6.5,
              '#b30000',
              8.5,
              '#7f0000',
              10.5,
              '#000'
            ],
            '#000'
          ]
        }
      })
    })

    let quakeID: string | number | undefined = undefined

    map.on('click', 'earthquakes-viz', (event) => {
      const clickedPoint = { lng: event.lngLat.lng, lat: event.lngLat.lat }

      // Use easeTo to smoothly transition to the clicked point
      map.easeTo({
        center: clickedPoint,
        duration: 1000, // Animation duration in milliseconds
        zoom: 7 // Optional: Zoom in slightly for better visibility
      })
    })

    map.on('mousemove', 'earthquakes-viz', (event) => {
      if (!event.features) return
      map.getCanvas().style.cursor = 'pointer'

      // Check whether features exist
      if (event.features.length === 0) return

      if (quakeID) {
        map.removeFeatureState({
          source: 'earthquakes',
          id: quakeID
        })
      }

      if (event.features[0].id) quakeID = event.features[0].id

      // When the mouse moves over the earthquakes-viz layer, update the
      // feature state for the feature under the mouse
      map.setFeatureState(
        {
          source: 'earthquakes',
          id: quakeID
        },
        {
          hover: true
        }
      )
    })

    map.on('mouseleave', 'earthquakes-viz', () => {
      if (quakeID) {
        map.setFeatureState(
          {
            source: 'earthquakes',
            id: quakeID
          },
          {
            hover: false
          }
        )
      }

      quakeID = undefined
      // Remove the information from the previously hovered feature from the sidebar
      // magDisplay.textContent = ''
      // locDisplay.textContent = ''
      // dateDisplay.textContent = ''
      // Reset the cursor style
      map.getCanvas().style.cursor = ''
    })
  })

  // Optionally, you can expose the map instance if needed
  // expose(map, 'map')
})
</script>

<style>
.map-container {
  flex: 1;
}
</style>
