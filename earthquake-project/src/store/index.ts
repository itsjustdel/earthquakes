import axios from 'axios'
import type { GeoJsonObject } from 'geojson'
import { createStore } from 'vuex'

interface State {
  earthquakeData: GeoJsonObject[]
  loading: boolean
}

export default createStore({
  state: {
    earthquakeData: [],
    loading: false
  } as State,
  getters: {},
  mutations: {
    setEarthquakeData(state, data) {
      state.earthquakeData = data
    },
    setLoading(state, value) {
      state.loading = value
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
        commit('setLoading', false)
      }
    }
  },
  modules: {}
})
