<template>
	<div
		v-if="true"
		class="not-allowed"
	>
		<div class="not-allowed-banner">
			<div class="not-allowed-text">
				<h2>Du har desværre ikke adgang til dette indhold</h2>
				<div>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
					magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
					consequat.
				</div>
			</div>
			<div class="not-allowed-lock">
				<img src="@/assets/images/lock.svg" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
export default defineComponent({
	name: 'NotAllowedBanner',
});
</script>

<style scoped>
.not-allowed {
	position: absolute;
	clear: both;
	z-index: 90;
	background-color: rgba(244, 182, 100, 0.3) !important;
	width: calc(100% + 25px);
	margin-left: -25px;
	height: calc(100% - 705px);
	margin-top: 31px;
}

.not-allowed-basic {
	position: absolute;
	clear: both;
	z-index: 90;
}

.not-allowed-banner {
	background-color: #002e70;
	justify-content: center;
	height: 250px;
	position: relative;
	width: 90%;
	border: 1px solid #f4b664;
	display: flex;
	flex-direction: row;
	color: white;
	margin-left: 36px;
	margin-top: 1%;
}

.not-allowed-text {
	width: 90%;
	text-align: left;
	margin-top: 20px;
	margin-left: 40px;
}

.not-allowed-lock {
	width: 10%;
	text-align: center;
	margin-top: 20px;
}

/* First breakpoint for tablet */

@media (min-width: 640px) {
	.not-allowed {
		width: calc(100% - 10px);
		margin-left: -25px;
		margin-top: 31px;
		height: calc(100% - 610px);
	}
	.not-allowed-banner {
		margin-left: 5%;
	}
}

@media (min-width: 720px) {
	.not-allowed {
		height: calc(100% - 570px);
	}
}

/* Second break for small screen */
@media (min-width: 800px) {
	.not-allowed {
		height: calc(100% - 570px);
	}
	.not-allowed-banner {
		margin-top: 5%;
	}
}

/* third break for large screen */
@media (min-width: 990px) {
	.not-allowed {
		margin-left: 0px;
		width: calc(100% - 50px);
		height: calc(100% - 508px);
		margin-top: 0px;
	}
	.not-allowed-banner {
		height: 250px;
		margin-top: 10%;
		margin-left: 10%;
		width: 80%;
		padding-left: 0px;
	}
}
</style>
