<template>
	<div
		class="container"
		id="search"
	>
		<div class="sg-wrapper">
			<form
				v-on:submit.prevent="search()"
				novalidate
				role="search"
			>
				<div
					role="group"
					class="rdl-advanced-search with-dropdown"
				>
					<div class="rdl-advanced-search-input">
						<label
							for="header"
							class="sr-only"
						></label>
						<input
							type="search"
							id="header"
							class="form-control"
							placeholder="Søg på titel, forfatter, tidsskrift, database etc."
							name=""
							v-model="searchQuery"
						/>
					</div>
					<div class="dropdown bootstrap-select">
						<select
							id="453276753"
							class="selectpicker"
							title=""
							data-style="btn-outline-primary"
							name=""
							data-size="false"
						>
							<option
								value="primo"
								data-content="<span class='sr-only'></span>Bøger og tidskrifter"
							></option>
							<option
								value="kbdk"
								data-content="<span class='sr-only'></span>Søg på KB.dk"
							></option>
							<option
								value="materials"
								data-content="<span class='sr-only'></span>Se alt materiale"
							></option>
						</select>
					</div>

					<button
						type="submit"
						aria-label="Søg"
						class="btn btn-primary btn-icon"
					>
						<span class="d-none d-search-inline-flex">Søg</span>
						<span class="d-inline-flex d-search-none"></span>
						<i
							class="material-icons"
							aria-hidden="true"
						>
							search
						</i>
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'SearchBar',
	data() {
		return {
			searchQuery: '',
		};
	},
	methods: {
		search: function () {
			if (this.searchQuery) {
				this.$router.push({ name: 'Search', query: { term: this.searchQuery } });
			}
		},
	},
});
</script>

<style lang="scss" scoped>
@import './search.scss';
.rdl-advanced-search-input .form-control {
	max-width: 100%;
}
</style>
