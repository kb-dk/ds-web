<template>
	<footer
		aria-label="footer"
		class="global-footer"
	>
		<nav
			v-if="currentLocaleMessages !== undefined"
			class="container"
		>
			<div class="row">
				<div class="column">
					<h2>{{ currentLocaleMessages.column1.title }}</h2>
					<ul>
						<li
							v-for="(link, index) in currentLocaleMessages.column1.links"
							:key="index"
						>
							<a
								:href="link.link"
								:data-testid="addTestDataEnrichment('link', 'footer', `${link.title}-column1`, Number(index))"
							>
								{{ link.title }}
							</a>
						</li>
					</ul>
				</div>
				<div class="column">
					<h2>{{ currentLocaleMessages.column2.title }}</h2>

					<ul>
						<li
							v-for="(link, index) in currentLocaleMessages.column2.links"
							:key="index"
						>
							<a
								:href="link.link"
								:data-testid="addTestDataEnrichment('link', 'footer', `${link.title}-column2`, Number(index))"
							>
								{{ link.title }}
							</a>
						</li>
					</ul>
				</div>
				<div class="column">
					<h2>{{ currentLocaleMessages.column3.title }}</h2>
					<ul>
						<li
							v-for="(link, index) in currentLocaleMessages.column3.links"
							:key="index"
						>
							<a
								:href="link.link"
								:data-testid="addTestDataEnrichment('link', 'footer', `${link.title}-column3`, Number(index))"
							>
								{{ link.title }}
							</a>
						</li>
						<li>
							<a
								id="csconsentlink"
								href="javascript:void(0)"
								:data-testid="addTestDataEnrichment('link', 'footer', `cookie-column4`, 0)"
							>
								{{ t('footer.cookie') }}
							</a>
						</li>
					</ul>
				</div>

				<div class="column">
					<div class="rdl-logo rdl-logo-inverted">
						<span class="sr-only">{{ t('footer.contactInfo') }}</span>
					</div>
					<ul>
						<li
							v-for="(link, index) in currentLocaleMessages.column4.links"
							:key="index"
						>
							<a
								v-if="link.link"
								:href="link.link"
								:data-testid="addTestDataEnrichment('link', 'footer', `${link.title}-column4`, Number(index))"
							>
								{{ link.title }}
							</a>
							<span v-else>{{ link.title }}</span>
						</li>
					</ul>
					<div class="some-icons">
						<ul>
							<li>
								<a
									class="rdl-some-link"
									:href="t('some.facebook.link')"
									:data-testid="addTestDataEnrichment('link', 'footer', `facebook-column4`, 0)"
								>
									<i class="rdl-icons">rdl_facebook</i>
									<span class="sr-only">{{ t('some.facebook.title') }}</span>
								</a>
							</li>
							<li>
								<a
									class="rdl-some-link"
									:href="t('some.instagram.link')"
									:data-testid="addTestDataEnrichment('link', 'footer', `instagram-column4`, 0)"
								>
									<i class="rdl-icons">rdl_instagram</i>
									<span class="sr-only">{{ t('some.instagram.title') }}</span>
								</a>
							</li>
							<li>
								<a
									class="rdl-some-link"
									:href="t('some.linkedin.link')"
									:data-testid="addTestDataEnrichment('link', 'footer', `linkedin-column4`, 0)"
								>
									<i class="rdl-icons">rdl_linkedin</i>
									<span class="sr-only">{{ t('some.linkedin.title') }}</span>
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</nav>
	</footer>
</template>
<script lang="ts">
import { defineComponent, toRaw, watch, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { FooterType } from '@/types/FooterType';
import { addTestDataEnrichment } from '@/utils/test-enrichments';

export default defineComponent({
	name: 'Footer',
	setup() {
		const { t, messages, locale } = useI18n();
		const currentLocaleMessages = ref(undefined as unknown as FooterType);

		onMounted(() => {
			currentLocaleMessages.value = toRaw(messages.value[locale.value].footer) as FooterType;
		});

		watch(
			() => locale.value,
			(newLocale: string, prevLocale: string) => {
				if (newLocale !== prevLocale) {
					currentLocaleMessages.value = toRaw(messages.value[locale.value].footer) as FooterType;
				}
			},
		);

		return { t, currentLocaleMessages, addTestDataEnrichment };
	},
});
</script>

<style scoped>
.rdl-icons {
	speak: none;
	word-wrap: normal;
	-ms-font-feature-settings: 'liga' 1;
	font-feature-settings: 'liga';
	-webkit-font-smoothing: antialiased;
	text-rendering: optimizeLegibility;
	-moz-osx-font-smoothing: grayscale;
	direction: ltr;
	display: inline-block;
	font-family: rdl-icons, serif;
	font-size: 20px;
	font-style: normal;
	font-variant-ligatures: discretionary-ligatures;
	font-weight: 400;
	letter-spacing: normal;
	line-height: 1;
	text-transform: none;
	white-space: nowrap;
}

.sr-only {
	clip: rect(0, 0, 0, 0);
	border: 0;
	height: 1px;
	margin: -1px;
	overflow: hidden;
	padding: 0;
	position: absolute;
	white-space: nowrap;
	width: 1px;
}

.some-icons li {
	display: inline-block;
}

.column a:hover {
	text-decoration: underline;
}

.rdl-logo-inverted {
	background-image: url('@/assets/images/logo-white.svg');
	height: 48px;
	margin-bottom: 32px;
	background-position: 0;
	background-repeat: no-repeat;
	background-size: contain;
}

.rdl-some-link {
	align-items: center;
	background-color: #fff;
	border-radius: 50%;
	display: inline-flex;
	height: 24px;
	justify-content: center;
	margin-right: 12px;
	width: 24px;
}

.rdl-some-link i {
	color: #002e70;
	font-size: 0.875rem;
}

h2 {
	font-weight: 700;
	line-height: 1.5rem;
	margin-bottom: 12px;
	font-size: 20px;
	margin-top: 0;
	padding-left: 5px;
}

.global-footer {
	width: 100%;
	overflow: hidden;
	background-color: #002e70;
	color: white;
	padding: 36px 0 0px;
	position: relative;
	bottom: 0px;
	box-sizing: border-box;
}

.global-footer li {
	list-style-type: none;
	margin-bottom: 12px;
}

a {
	color: white;
	text-decoration: none;
}

.global-footer ul {
	padding: 0;
	padding-left: 5px;
}

.column {
	padding-left: 12px;
	padding-right: 12px;
	position: relative;
	box-sizing: border-box;
	flex: 0 0 100%;
	max-width: 100%;
	padding-bottom: 48px;
}

.row {
	display: flex;
	flex-wrap: wrap;
	margin-left: -12px;
	margin-right: -12px;
}

/* MEDIA QUERY 480 */
@media (min-width: 480px) {
	.container {
		max-width: 640px;
	}
	.column {
		flex: 0 0 50%;
		max-width: 50%;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.container {
		max-width: 990px;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.column {
		flex: 0 0 25%;
		max-width: 25%;
		padding-bottom: 0px;
	}
	.global-footer {
		padding: 36px 0 40px;
	}
	.container {
		max-width: 1150px;
	}
}
/* MEDIA QUERY 1150 */
@media (min-width: 1150px) {
	.container {
		max-width: 1280px;
	}
}
/* MEDIA QUERY 1280 */
@media (min-width: 1280px) {
	.container {
		margin: auto;
		padding-right: 0;
		padding-left: 0;
	}
}
</style>
