<template>
  <div>
    <div class="hit-count" v-if="hitCount > 0 || noHits">Hits found - {{ hitCount }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { useSearchResultStore } from "@/store/searchResults"

export default defineComponent({
  name: "HitCount",
  props: {
    hitCount: { type: Number, required: true },
    noHits: { type: Boolean, required: true }
  },

  setup() {
    const searchResultStore = useSearchResultStore()
    return { searchResultStore }
  }
})
</script>
