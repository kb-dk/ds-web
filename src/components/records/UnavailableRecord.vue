<template>
	<div class="unavailable-record">
		<div class="not-found-details">
			<h2>{{ t('record.noRecordFound') }}</h2>
			<p>{{ t('record.noRecordFoundExplained') }}</p>
			<h2>{{ t('error.wrongUrl.altHeader') }}</h2>
			<div class="extra-suggest">
				<a
					class="btn-blue btn"
					href="/find-materiale/dr-arkivet/"
					:data-testid="addTestDataEnrichment('button', 'unavailable-record', 'link-to-home', 0)"
				>
					{{ t('error.wrongUrl.frontPage') }}
				</a>
				<a
					class="btn-blue btn"
					:href="t('footer.column1.links.1.link')"
					:data-testid="addTestDataEnrichment('button', 'unavailable-record', 'link-to-about', 0)"
				>
					{{ t('footer.column1.links.1.title') }}
				</a>
				<a
					class="btn-blue btn"
					href="https://www.kb.dk"
					:data-testid="addTestDataEnrichment('button', 'unavailable-record', 'link-to-kb', 0)"
				>
					{{ t('error.wrongUrl.kbPage') }}
				</a>
			</div>
		</div>
		<EdgedContentArea
			:lines="true"
			:line-padding="false"
			background-color="#002e70"
			:title="t('search.mainCategories')"
		>
			<template #content>
				<MainCategories />
			</template>
		</EdgedContentArea>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import MainCategories from '@/components/common/MainCategories.vue';
import EdgedContentArea from '@/components/global/content-elements/EdgedContentArea.vue';

export default defineComponent({
	name: 'GenericRecord',
	components: {
		MainCategories,
		EdgedContentArea,
	},
	setup() {
		const { t } = useI18n();
		return { t, addTestDataEnrichment };
	},
});
</script>
<style scoped>
.not-found-details {
	display: flex;
	flex-direction: column;
	width: 100%;
	padding-bottom: 25px;
}

.btn {
	display: inline-block;
	font-weight: 400;
	color: #171717;
	text-align: center;
	text-decoration: none;
	vertical-align: middle;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	background-color: transparent;
	border: 1px solid transparent;
	border-top-color: transparent;
	border-right-color: transparent;
	border-bottom-color: transparent;
	border-left-color: transparent;
	padding: 13px 2.875rem;
	font-size: 1rem;
	line-height: 1.25rem;
	border-radius: 0.25rem;
	transition:
		color 0.15s ease-in-out,
		background-color 0.15s ease-in-out,
		border-color 0.15s ease-in-out,
		box-shadow 0.15s ease-in-out;
	margin-right: 15px;
	margin-bottom: 15px;
	white-space: nowrap;
}
.btn-light {
	color: #212529;
	background-color: #f2f4f8;
	border-color: #f2f4f8;
}
.btn-blue {
	color: white;
	background-color: #002e70;
	border-color: #f2f4f8;
}
.btn-light:hover {
	color: #212529;
	background-color: #d9dfeb;
	border-color: #d1d8e6;
}

.btn-blue:hover {
	background-color: #c4f1ed;
	color: #002e70;
	border-color: #002e70;
}
</style>
