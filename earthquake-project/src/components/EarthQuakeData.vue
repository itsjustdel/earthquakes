<template>
  <div>
    <h1>Data Fetching Example</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <ul>
        <li v-for="(quake, index) in earthquakeData?.features" :key="index">
          {{ quake.properties.place }} - Magnitude: {{ quake.properties.mag }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import type { FeatureCollection } from '@/types/earthquake'

const store = useStore()

const earthquakeData = computed<FeatureCollection>(() => store.state.earthquakeData)
const loading = computed(() => store.state.loading)

onMounted(() => {
  store.dispatch('fetchData')
})
</script>