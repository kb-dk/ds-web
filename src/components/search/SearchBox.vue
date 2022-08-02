<template>
  <div class="sg-wrapper">
    <h3 class="sg-header">Advanced search (ie. header)</h3>
    <hr class="sg-hr" />
    <form v-on:submit.prevent="$emit('search-triggered', searchQuery)" novalidate role="search">
      <div role="group" class="rdl-advanced-search with-dropdown">
        <div class="rdl-advanced-search-input">
          <label for="mainSearchInput" class="sr-only">Søg på titel, forfatter, tidsskrift, database m.m.</label>
          <input
            type="search"
            id="mainSearchInput"
            class="form-control"
            placeholder="Søg på titel, forfatter, tidsskrift, database m.m."
            name="advancedSearch"
            v-model="searchQuery"
          />
        </div>
        <select id="448365207" class="selectpicker" title="" data-style="btn-outline-primary" name="" data-size="false">
          <option value="Bøger og tidsskrifter" data-content="<span class='sr-only'>filtrér på</span>Bøger og tidsskrifter"></option>
          <option
            value="Aviser, radio, TV og reklamefilm"
            data-content="<span class='sr-only'>filtrér på</span>Aviser, radio, TV og reklamefilm"
          ></option>
          <option value="Søg på kb.dk" data-content="<span class='sr-only'>Søg på hele siden</span>Søg på kb.dk"></option>
          <option value="Se alt materiale" data-content="<span class='sr-only'>link til søgesiden</span>Se alt materiale"></option>
        </select>
        <button type="submit" aria-label="" class="btn btn-primary btn-icon">
          <span class="d-none d-search-inline-flex">Søg</span>
          <span class="d-inline-flex d-search-none">Søg her</span>
          <i class="material-icons" aria-hidden="true">search</i>
        </button>
      </div>
    </form>
  </div>
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
