<template>
  <form v-on:submit.prevent="$emit('search-triggered', searchQuery)" novalidate>
    <input type="text" placeholder="Search..." v-model="searchQuery" />
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "SearchBox",
  data() {
    return {
      searchQuery: ""
    }
  }
})
</script>
