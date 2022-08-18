<template>
	<Header />
	<div class="nav-container">
		<div
			id="nav"
			class="rdl-li"
		>
		</div>
	</div>
	<div class="content">
		<router-view />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from './components/navigation/Header.vue';

export default defineComponent({
	name: 'App',
	components: { Header },
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

.content {
	position: relative;
	height: 100vh;
	background-color: white;
	z-index: 2;
}
</style>
