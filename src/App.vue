<template>
	<div class="app">
		<Notifier></Notifier>
		<Spinner></Spinner>
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
import Notifier from '@/components/notification/Notifier.vue';
import Spinner from '@/components/search/Spinner.vue';

export default defineComponent({
	name: 'App',
	components: {
		Notifier,
		Spinner,
	},
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
		window.addEventListener('change-path', this.gotoPath);
	},
	beforeUnmount() {
		window.removeEventListener('locale-switch', this.switchLocale);
		window.removeEventListener('change-path', this.gotoPath);
	},
	methods: {
		gotoPath(e: Event) {
			e.preventDefault();
			this.changePath(e as CustomEvent);
			//console.log(this, e);
		},
		changePath(e: CustomEvent) {
			this.$router.push({ path: e.detail.path });
		},
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
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

/* This probably shouldn't be here. We need a place for global styles at some point i guess */
@font-face {
	font-family: 'noway';
	font-style: normal;
	font-weight: 400;
	src: url('./assets/fonts/noway-regular-webfont.woff2') format('woff2');
}
body {
	margin: 0;
	padding: 0;
	overscroll-behavior: none;
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

#app {
	//font-family: Avenir, Helvetica, Arial, sans-serif;
	font-family: noway, sans-serif;
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
	//z-index: 2;
}

@media (min-width: 1280px) {
	.content {
		display: flex;
		justify-content: center;
	}
}

.lang-switcher {
	float: right;
}
</style>
