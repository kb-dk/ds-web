<template>
  <div>Do some search stuff here</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { useSearchResultStore } from "@/store/searchResults"

export default defineComponent({
  name: "Search",
  components: {},

  setup() {
    const searchResult = useSearchResultStore()
    console.log(searchResult)
    return searchResult
  }
})
</script>
