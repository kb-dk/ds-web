<template>
	<div
		v-if="!authStore.isAllowedToDisplayContent"
		class="not-allowed"
	>
		<div class="not-allowed-banner">
			<div class="not-allowed-text">
				<h2>{{ $t('error.auth.notAllowedHeader') }}</h2>
				<div>
					{{ $t('error.auth.notAllowedText') }}
					<a
						:href="$t('search.nohitSubtitle.link')"
						:data-testid="addTestDataEnrichment('link', 'NotAllowedBanner', `Link-to-read-more`, 0)"
					>
						{{ $t('search.portals.drArchive') }}
					</a>
				</div>
			</div>
			<div class="not-allowed-lock">
				<span class="material-icons">lock</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { addTestDataEnrichment } from '@/utils/test-enrichments';

export default defineComponent({
	name: 'NotAllowedBanner',
	setup() {
		const authStore = useAuthStore();
		return { authStore, addTestDataEnrichment };
	},
});
</script>

<style scoped>
.not-allowed {
	position: absolute;
	z-index: 11;
	background-color: rgba(244, 182, 100, 0.3);
	width: 100%;
	height: calc(100% - 60px);
}

.not-allowed-banner {
	background-color: #002e70;
	justify-content: center;
	height: 200px;
	position: relative;
	width: 98%;
	border: 1px solid #f4b664;
	display: flex;
	flex-direction: row;
	color: white;
	margin-left: 1%;
	margin-top: 1%;
	font-size: 14px;
}

.not-allowed-text {
	width: 90%;
	text-align: left;
	margin-top: 20px;
	margin-left: 40px;
}

.not-allowed-text a {
	color: white;
}

.not-allowed-lock {
	width: 10%;
	text-align: center;
	margin-top: 20px;
	color: #f4b664;
}

.not-allowed-lock .material-icons {
	font-size: 40px;
}

/* First breakpoint for tablet */

@media (min-width: 640px) {
	.not-allowed-banner {
		margin-left: 5%;
		width: 90%;
		font-size: 16px;
	}
}

/* Second break for small screen */
@media (min-width: 800px) {
	.not-allowed-banner {
		margin-top: 5%;
	}
}

/* third break for large screen */
@media (min-width: 990px) {
	.not-allowed {
		margin-left: 0px;
		width: 100%;
		height: 100%;
		margin-top: 0px;
		padding-top: 0px;
		padding-bottom: 0px;
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
