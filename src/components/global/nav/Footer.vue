<template>
	<footer class="global-footer">
		<nav class="container">
			<div class="row">
				<div class="column">
					<h2>Genveje</h2>
					<ul>
						<li
							v-for="(link, index) in t('footer.column1.links')"
							:key="index"
						>
							HEJ, {{ link }}
						</li>
					</ul>
				</div>
				<div class="column">
					<h2>Brug os</h2>
					<ul>
						<li><a href="#">For biblioteker</a></li>
						<li><a href="#">Møder og konferencer</a></li>
						<li><a href="#">Det Administrative Bibliotek</a></li>
						<li><a href="#">Pligtaflevering</a></li>
						<li><a href="#">For skoler</a></li>
					</ul>
				</div>
				<div class="column">
					<h2>Information</h2>
					<ul>
						<li><a href="#">Spørg biblioteket</a></li>
						<li><a href="#">ledige stillinger</a></li>
						<li><a href="#">Presse</a></li>
						<li><a href="#">Privatlivs- og persondatapolitik</a></li>
						<li><a href="#">Tilgængelighedserklæring</a></li>
						<li><a href="#">Reglementer</a></li>
						<li><a href="#">Driftsstatus</a></li>
					</ul>
				</div>

				<div class="column">
					<div
						id="header-814861072"
						class="rdl-logo rdl-logo-inverted"
					>
						<span class="sr-only">Kontaktinformationer</span>
					</div>
					<div aria-label="">
						<p>
							Tel:
							<a href="tel:">(+45) 3347 4747</a>
						</p>
					</div>
					<div aria-label="E-post adresse">
						<p><a href="mailto:kb@kb.dk">kb@kb.dk</a></p>
					</div>
					<div aria-label="EAN nummer">
						<p>EAN: 5798000795297</p>
					</div>
					<div
						class="some-icons"
						aria-label="Sociale mediekanaler"
					>
						<a
							href="#"
							title="facebook"
							class="rdl-some-link"
						>
							<i
								class="rdl-icons"
								aria-hidden="true"
							>
								rdl_facebook
							</i>
							<span class="sr-only"></span>
						</a>

						<a
							href="#"
							title="twitter"
							class="rdl-some-link"
						>
							<i
								class="rdl-icons"
								aria-hidden="true"
							>
								rdl_twitter
							</i>
							<span class="sr-only"></span>
						</a>

						<a
							href="#"
							title="linkedIn"
							class="rdl-some-link"
						>
							<i
								class="rdl-icons"
								aria-hidden="true"
							>
								rdl_linkedin
							</i>
							<span class="sr-only"></span>
						</a>

						<a
							href="#"
							title="Instagram"
							class="rdl-some-link"
						>
							<i
								class="rdl-icons"
								aria-hidden="true"
							>
								rdl_instagram
							</i>
							<span class="sr-only"></span>
						</a>
					</div>
				</div>
			</div>
		</nav>
	</footer>
</template>
<script lang="ts">
import { defineComponent, toRaw } from 'vue';
import { useI18n } from 'vue-i18n';

interface Footer {
	[column: string]: {
		title: string;
		links: {
			[link: string]: {
				title: string;
				link: string;
			};
		};
	};
}

export default defineComponent({
	name: 'Footer',
	setup() {
		const { t, messages, locale } = useI18n();

		// Type assertion to specify the type of currentLocaleMessages
		const currentLocaleMessages: Footer = messages.value[locale.value].footer as Footer;

		console.log(toRaw(currentLocaleMessages));

		return { t };
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

.rdl-logo-inverted {
	background-image: url('../../../assets/images/logo-white.svg');
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
}

.global-footer {
	background-color: #002e70;
	color: white;
	padding: 36px 0 40px;
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
}

.column {
	padding-left: 12px;
	padding-right: 12px;
	position: relative;
	box-sizing: border-box;
	flex: 0 0 50%;
	max-width: 50%;
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
