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

const mapContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  const loading = computed(() => store.state.loading)

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
    store.dispatch('setMapInstance', map)

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

    map.on('click', 'earthquakes-viz', (event) => {
      const clickedPoint = { lng: event.lngLat.lng, lat: event.lngLat.lat }

      map.flyTo({
        center: clickedPoint,
        duration: 1000,
        zoom: 7
      })
    })

    map.on('mousemove', 'earthquakes-viz', (event) => {
      if (!event.features || !event.features[0].id) return

      const quakeID = event.features[0].id

      map.removeFeatureState({
        source: 'earthquakes',
        id: quakeID
      })

      map.setFeatureState(
        {
          source: 'earthquakes',
          id: quakeID
        },
        {
          hover: true
        }
      )

      map.getCanvas().style.cursor = 'pointer'
    })

    map.on('mouseleave', 'earthquakes-viz', (event) => {
      if (!event.features || !event.features[0].id) return

      const quakeID = event.features[0].id
      map.setFeatureState(
        {
          source: 'earthquakes',
          id: quakeID
        },
        {
          hover: false
        }
      )

      map.getCanvas().style.cursor = ''
    })
  })
})
</script>

<style>
.map-container {
  flex: 1;
}
</style>
