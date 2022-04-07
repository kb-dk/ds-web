<template>
  <div class="home">
    This will be the main landing page for the DS app
    <SpotlightCampaign msg="Here some added content wil be placed" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import SpotlightCampaign from "@/components/SpotlightCampaign.vue" // @ is an alias to /src

export default defineComponent({
  name: "Home",
  components: {
    SpotlightCampaign
  }
})
</script>
