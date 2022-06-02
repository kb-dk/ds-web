<template>
  <div class="hit-box" v-for="res in searchResults" :key="res.id">
    <SearchResultItem :search-item-data="res" />
    <div class="hit-img">
      <ImageItem :img-src="getImgServerSrcURL(res.pages[0])" />
    </div>
    <hr />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { GenericSearchResult } from "../../types/GenericSearchResult"
import SearchResultItem from "@/components/search/SearchResultItem.vue"
import ImageItem from "@/components/search/ImageItem.vue"

export default defineComponent({
  name: "SearchResults",
  components: {
    SearchResultItem,
    ImageItem
  },

  props: {
    searchResults: { type: Object as PropType<GenericSearchResult[]>, required: true }
  },

  methods: {
    getImgServerSrcURL(url: string) {
      return url.replace(/.info.json$/, "/full/!250,150/0/native.jpg")
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 
temporary styling until patterns from design system are implemented 
-->
<style scoped>
.hit-box {
  padding: 0 0 10px 0;
}

.hit-img {
  width: 10%;
}
</style>
