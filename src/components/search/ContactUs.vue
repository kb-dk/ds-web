<template>
	<div :class="`contact ${relativePosition ? 'relative' : ''}`">
		<h1>{{ t('search.contactUs') }}</h1>
		<a
			class="btn-blue btn"
			:href="t('footer.column4.links.1.link')"
			:data-testid="addTestDataEnrichment('button', 'ContactUs', 'link-to-ask-about-library', 0)"
		>
			<p>{{ t('footer.column4.links.1.title') }}</p>
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
	top: calc(-6vw);
	left: 1%;
}
.relative {
	position: relative;
}
.btn {
	display: inline-block;
	font-weight: 400;
	color: #171717;
	text-align: center;
	text-decoration: none;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	background-color: transparent;
	outline: none;
	padding: 1px 2rem;
	font-size: 1rem;
	line-height: 1.25rem;
	border-radius: 5px;
	transition:
		color 0.15s ease-in-out,
		background-color 0.15s ease-in-out,
		border-color 0.15s ease-in-out,
		box-shadow 0.15s ease-in-out;
	margin-right: 15px;
	margin-bottom: 15px;
	white-space: nowrap;
}

.btn > * {
	display: inline-block;
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
	outline: 1px solid #002e70;
}

.material-icons {
	position: relative;
	top: 7px;
	margin-left: 15px;
}

@media (min-width: 990px) {
	.contact {
		left: 15%;
	}
}
</style>
