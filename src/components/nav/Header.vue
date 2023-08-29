<template>
	<div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import './header-component';
import './desk-component';
import './mobile-component';

export default defineComponent({
	name: 'Header',
	props: {},

	setup() {
		console.log('header setup');
	},
});
</script>
