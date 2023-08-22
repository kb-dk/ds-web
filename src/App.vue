<template>
	<div class="container">
		<div
			class="wipe"
			ref="wipe"
		></div>
		<nav>
			NAVIGATION GOES HERE
			<router-link to="/about">About</router-link>
			<router-link to="/">Search</router-link>
		</nav>
	</div>
	<div class="content">
		<router-view v-slot="{ Component }">
			<transition
				:duration="{ enter: 500, leave: 500 }"
				@before-enter="onBeforeEnter"
				@before-leave="onBeforeLeave"
				name="fade"
				mode="out-in"
			>
				<component :is="Component" />
			</transition>
		</router-view>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import gsap from 'gsap';

export default defineComponent({
	name: 'App',
	components: {},
	created() {
		console.log(gsap);
	},
	methods: {
		onBeforeLeave() {
			console.log('LEAVE STARTED');
			const elem = this.$refs.wipe as HTMLElement;
			gsap.to(elem, {
				//opacity: 1,
				transform: 'translateX(100%)',
				duration: 0.7,
				overwrite: true,
				ease: 'power0.inOut',
				onComplete: () => {
					console.log('LEAVE DONE');
				},
			});
		},
		onBeforeEnter() {
			console.log("ENTER STARTED")
			const elem = this.$refs.wipe as HTMLElement;
			gsap.to(elem, {
				//opacity: 0,
				duration: 0.7,
				delay: 5.3,
				transform: 'translateX(100%)',
				overwrite: true,
				ease: 'power0.inOut',
				onComplete: () => {
					console.log('ENTER DONE!');
					gsap.set(elem, { transform: 'translateX(-100%)' });
				},
			});
		},
	},
});
</script>

<style lang="scss">
.wipe {
	opacity: 1;
	pointer-events: none;
	z-index: 50;
	top: 0;
	margin: 0;
	left: 0;
	padding: 0;
	position: fixed;
	width: 100vw;
	height: 100vh;
	transform: translateX(-100%);
	background-color: blue;
}

.fade-enter-active,
.fade-leave-active {
	//transition: opacity 0.01s linear 0.175s;
}

.fade-enter-from,
.fade-leave-to {
	//opacity: 0;
}
.container {
	text-align: left;
	padding-right: 12px;
	padding-left: 12px;
	margin-right: auto;
	margin-left: auto;
}

nav {
	flex-basis: 0;
	flex-grow: 1;
	max-width: 100%;
	position: relative;
	width: 100%;
	padding-right: 12px;
	padding-left: 12px;
	box-sizing: border-box;
}
/* MEDIA QUERY 480 */
@media (min-width: 480px) {
	.container {
		max-width: 640px;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.container {
		max-width: 990px;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.container {
		display: flex;
		flex-direction: column;
		max-width: 1150px;
	}
}
/* MEDIA QUERY 1150 */
@media (min-width: 1150px) {
	.container {
		max-width: 1280px;
	}
}
/* MEDIA QUERY 1280 */
@media (min-width: 1280px) {
	.container {
		padding-right: 0;
		padding-left: 0;
	}
}
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
	//height: 100vh;
	background-color: white;
	z-index: 2;
}
</style>
