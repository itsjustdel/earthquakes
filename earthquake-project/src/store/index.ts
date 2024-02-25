import axios from 'axios'
import type { Feature, GeoJsonObject } from 'geojson'
import type mapboxgl from 'mapbox-gl'
import { createStore } from 'vuex'

interface State {
  earthquakeData: GeoJsonObject[]
  map: mapboxgl.Map | null
  loading: boolean
  hoveredFeature: Feature | null
}

export default createStore({
  state: {
    earthquakeData: [],
    map: null,
    loading: false,
    hoveredFeature: null
  } as State,
  getters: {},
  mutations: {
    setEarthquakeData(state, data) {
      state.earthquakeData = data
    },
    setLoading(state, value) {
      state.loading = value
    },
    setHoveredFeature(state, feature) {
      state.hoveredFeature = feature
    },
    setMap(state, map) {
      state.map = map
    }
  },
  actions: {
    async fetchData({ commit }) {
      commit('setLoading', true)
      try {
        const response = await axios.get<GeoJsonObject[]>(
          'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'
        )
        commit('setEarthquakeData', response.data)
        console.log('Fetched data:', response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        console.log('setting is loading false')
        commit('setLoading', false)
      }
    },
    setMapInstance({ commit }, map) {
      commit('setMap', map)
    }
  },
  modules: {}
})
