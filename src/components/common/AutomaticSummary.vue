<template>
	<div class="container">
		<div class="description-container">
			<h3>{{ t('record.automaticSummaries.title') }}</h3>
			<p>{{ description }}</p>
		</div>
		<div class="info-container">
			<div class="info"><span class="material-icons">info_i</span></div>
			<div class="info-text">
				<p>
					{{ t('record.automaticSummaries.summaryInfo') }}
				</p>
				<div class="link-container">
					<span class="material-icons">link</span>
					<a
						:href="t('record.automaticSummaries.readMoreUrl')"
						target="_blank"
					>
						{{ t('record.automaticSummaries.readMoreLink') }}
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'AutomaticSummary',
	props: {
		description: {
			type: String,
			required: true,
		},
	},
	setup() {
		const { t } = useI18n();

		return { t };
	},
});
</script>

<style scoped>
h3,
p {
	margin: 0;
	padding: 0;
}
.info .material-icons {
	color: var(--color-default);
	font-size: 15px;
}
.link-container {
	display: flex;
	align-items: center;
	gap: 5px;
}
.link-container a {
	color: var(--color-default);
}
.info {
	justify-content: center;
	align-items: center;
	display: flex;
	width: 20px;
	height: 20px;
	background-color: var(--bg-main);
	border-radius: 50%;
	min-width: 20px;
	margin-top: 5px;
}
.info-text {
	display: flex;
	flex-direction: column;
}
.info-container {
	margin-top: 10px;
	margin-bottom: 36px;
	display: flex;
	flex-direction: row;
	gap: 7px;
}
.description-container {
	display: flex;
	flex-direction: column;
	background-color: var(--bg-main-3);
	padding: 30px 46px 25px 35px;
	gap: 7px;
}
</style>
