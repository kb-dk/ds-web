<template>
  <figure class="image-wrapper">
    <img class="image-item" :src="imgSrc" alt="cover image" />
  </figure>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "ImageItem",
  props: {
    imgSrc: String
  }
})
</script>
