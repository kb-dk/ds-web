<template>
	<div>
		<div class="nav-container">
			<div
				id="nav"
				class="rdl-li"
			>
				<router-link to="/">Home</router-link>
				|
				<router-link to="/about">About</router-link>
			</div>
			<SearchBar />
		</div>
	</div>
	<div class="content">
		<router-view />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SearchBar from './components/search/SearchBar.vue';

export default defineComponent({
	name: 'App',
	components: { SearchBar },
});
</script>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav {
	padding: 30px;
	display: flex;
}

#nav a {
	font-weight: bold;
	color: #2c3e50;
}

#nav a.router-link-exact-active {
	color: #42b983;
}

.nav-container {
	background-color: $sky-blue-100;
	position: relative;

	&::after {
		content: '';
		position: absolute;
		top: 83%;
		right: 0;
		left: 0;
		z-index: 1;
		height: 100%;
		background-color: white;
		transform: skewY(-2deg);
	}
}

.content {
	position: relative;
	height: 100vh;
	background-color: white;
	z-index: 2;
}
</style>
