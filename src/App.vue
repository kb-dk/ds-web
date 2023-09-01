<template>
	<div class="container">
		<kb-menu :locale="locale"></kb-menu>
		<div
			class="wipe"
			ref="wipe"
		>
			<img :src="getImgServerSrcURL()" />
		</div>
	</div>
	<div class="content">
		<router-view v-slot="{ Component }">
			<transition
				:duration="{ enter: td * 1000, leave: td * 1000 }"
				@before-leave="onBeforeLeave"
				@before-enter="onBeforeEnter"
				mode="out-in"
			>
				<component :is="Component" />
			</transition>
		</router-view>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import './components/nav/menu-component';
import gsap from 'gsap';

export default defineComponent({
	name: 'App',
	data() {
		return {
			td: 0.35,
			leaveDone: false,
			locale: 'da',
		};
	},
	created: function () {
		//Remember to check for init locale once we now where to get it from
		window.addEventListener('locale-switch', this.switchLocale);
	},
	methods: {
		switchLocale(e: Event) {
			e.preventDefault();
			this.$i18n.locale = this.locale = this.$i18n.locale === 'da' ? 'en' : 'da';
		},

		getImgServerSrcURL() {
			return require('@/assets/images/crown.png');
		},
		onBeforeLeave() {
			console.log('ON BEFORE LEAVE');
			const elem = this.$refs.wipe as HTMLElement;
			gsap.set(elem, { clipPath: 'polygon(0% 0%,0% 0%,0% 0%,0% 0%,0% 0%,0% 0%)' });
			gsap.to(elem, {
				//transform: 'translateX(0%)',
				clipPath: 'polygon(100% 0%,0% 0%,0% 0%,0% 100%,0% 100%,100% 0%)',
				duration: this.td / 2,
				ease: 'linear',
				overwrite: true,
				onComplete: () => {
					gsap.to(elem, {
						//transform: 'translateX(0%)',
						clipPath: 'polygon(100% 0%,0% 0%,0% 0%,0% 100%,100% 100%,100% 100%)',
						duration: this.td / 2,
						ease: 'linear',
						overwrite: true,
					});
					this.leaveDone = true;
				},
			});
		},
		onBeforeEnter() {
			if (!this.leaveDone) return;
			const elem = this.$refs.wipe as HTMLElement;
			gsap.to(elem, {
				//opacity: 0,
				duration: this.td / 2,
				overwrite: true,
				clipPath: 'polygon(100% 0%,100% 0%,0% 100%,0% 100%,100% 100%,100% 100%)',
				//transform: 'translateX(100%)',
				ease: 'linear',
				onComplete: () => {
					gsap.to(elem, {
						//transform: 'translateX(0%)',
						clipPath: 'polygon(100% 100%,100% 100%,100% 100%,100% 100%,100% 100%,100% 100%)',
						duration: this.td / 2,
						ease: 'linear',
						overwrite: true,
					});
					this.leaveDone = false;
				},
			});
		},
	},
});
</script>

<style lang="scss">
body {
	margin: 0;
	padding: 0;
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
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
	clip-path: polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%);
	display: flex;
	justify-content: center;
	align-content: center;
	flex-wrap: wrap;
	//transform: translateX(-100%);
	background-color: #002e70;
}
/*
.container {
	text-align: left;
	padding-right: 12px;
	padding-left: 12px;
	margin-right: auto;
	margin-left: auto;
} */

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
/* // MEDIA QUERY 480 
@media (min-width: 480px) {
	.container {
		max-width: 640px;
	}
}
// MEDIA QUERY 640 
@media (min-width: 640px) {
	.container {
		max-width: 990px;
	}
}
// MEDIA QUERY 990
@media (min-width: 990px) {
	.container {
		display: flex;
		flex-direction: column;
		max-width: 1150px;
	}
}
// MEDIA QUERY 1150 
@media (min-width: 1150px) {
	.container {
		max-width: 1280px;
	}
}
// MEDIA QUERY 1280
@media (min-width: 1280px) {
	.container {
		padding-right: 0;
		padding-left: 0;
	}
}
*/
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
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

.lang-switcher {
	float: right;
}
</style>
