<template>
	<div :class="`${relativePosition ? 'contact-relative' : 'contact'}`">
		<h2>{{ t('search.contactUs') }}</h2>
		<a
			class="btn-blue btn"
			:href="t('footer.column4.links.1.link')"
			:data-testid="addTestDataEnrichment('button', 'ContactUs', 'link-to-ask-about-library', 0)"
		>
			<p class="btn-medium">{{ t('footer.column4.links.1.title') }}</p>
			<span class="material-icons">chat_bubble</span>
		</a>
	</div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
export default defineComponent({
	name: 'ContactUs',
	props: {
		relativePosition: {
			type: Boolean as PropType<boolean>,
			required: false,
			default() {
				return true;
			},
		},
	},
	setup() {
		const { t } = useI18n();
		return { t, addTestDataEnrichment };
	},
});
</script>
<style scoped>
.contact {
	margin-left: 1%;
}
.contact-relative {
	position: relative;
	top: calc(-6vw);
	left: 1%;
}
.btn {
	background-color: #0a2e70;
	width: fit-content;
	color: white;
	text-align: center;
	text-decoration: none;
	border-radius: 4px;
	height: 40px;
	display: flex;
	box-sizing: border-box;
	margin-bottom: 15px;
	padding: 5px 14px 9px 14px;
	flex-direction: row;
	justify-content: center;
	white-space: nowrap;
	border: 1px solid #0a2e70;
}
.btn > .btn-medium {
	margin: 0;
}
.btn-blue {
	color: white;
	background-color: #002e70;
	border-color: #f2f4f8;
}

.btn-blue:hover {
	background-color: #c4f1ed;
	color: #002e70;
	border-color: #002e70;
}

.material-icons {
	position: relative;
	top: 5px;
	margin-left: 15px;
}

@media (min-width: 990px) {
	.contact-relative {
		left: 15%;
	}
	.contact {
		margin-left: 0;
	}
}
</style>
