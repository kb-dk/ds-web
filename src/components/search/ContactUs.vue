<template>
	<div :class="`${relativePosition ? 'contact-relative' : 'contact'}`">
		<h2>{{ t('search.contactUs') }}</h2>
		<KBButton
			class="btn-medium"
			:button-text="t('footer.column4.links.1.title')"
			button-type="btn-main-medium"
			button-color="main"
			button-size="medium"
			:is-router-link="true"
			:href="t('footer.column4.links.1.link')"
			left-icon-name="chat_bubble"
			:data-testid="addTestDataEnrichment('button', 'ContactUs', 'link-to-ask-about-library', 0)"
		></KBButton>
	</div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import KBButton from '@/components/common/KBButton.vue';
export default defineComponent({
	name: 'ContactUs',
	components: { KBButton },
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
	color: var(--color-main);
}
.contact-relative {
	position: relative;
	top: calc(-6vw);
	left: 1%;
	color: var(--color-main);
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
