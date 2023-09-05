type TranslationItem = {
	title: string;
	link: string;
	icon?: string;
	id?: string;
};

type Translation = {
	da: {
		primary: TranslationItem[];
		secondary: TranslationItem[];
	};
	en: {
		primary: TranslationItem[];
		secondary: TranslationItem[];
	};
};

class MenuComponent extends HTMLElement {
	shadow: ShadowRoot;
	lang: string;
	translation: Translation;

	constructor() {
		super();
		this.translation = {
			da: {
				secondary: [
					{ title: 'Lån og aflvering', link: '#' },
					{ title: 'Bliv bruger', link: '#' },
					{ title: 'Om os', link: '#' },
					{ title: 'Åbningstider', link: '#' },
					{ title: 'Webshop', link: '#' },
					{ title: 'In english', link: '#', id: 'localeSwitcher' },
					{ title: 'Log in', link: '#', icon: 'account_circle' },
				],
				primary: [
					{ title: 'Find materiale', link: '#' },
					{ title: 'Inspiration', link: '#' },
					{ title: 'Arrangementer', link: '#' },
					{ title: 'Services', link: '#' },
					{ title: 'Besøg os', link: '#' },
					{ title: 'Søg', link: '#', icon: 'search' },
				],
			},
			en: {
				secondary: [
					{ title: 'Collect and return', link: '#' },
					{ title: 'New user', link: '#' },
					{ title: 'About us', link: '#' },
					{ title: 'Webshop', link: '#' },
					{ title: 'På dansk', link: '#', id: 'localeSwitcher' },
					{ title: 'Log in', link: '#', icon: 'account_circle' },
				],
				primary: [
					{ title: 'Find materials', link: '#' },
					{ title: 'Inspiration', link: '#' },
					{ title: 'Events', link: '#' },
					{ title: 'Services', link: '#' },
					{ title: 'Visit us', link: '#' },
					{ title: 'Search', link: '#', icon: 'search' },
				],
			},
		};
		this.lang = 'da';

		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.innerHTML = MENU_COMPONENT_TEMPLATE + MENU_COMPONMENT_STYLES;

		this.createFullHeaderMenu();
	}

	static get observedAttributes() {
		return ['locale'];
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === 'locale') {
			this.lang = newValue;
			this.createFullHeaderMenu();
		}
	}

	dispatchLocaleSwitch(e: Event) {
		window.dispatchEvent(new Event('locale-switch'));
		e.preventDefault();
	}

	createFullHeaderMenu() {
		const main: HTMLElement | null = this.shadow.querySelector('.rdl-main-navigation');
		if (main) {
			main.innerHTML = '';
			this.createSingleMenu(main, this.translation[this.lang === 'da' ? 'da' : 'en'].primary, 'rdl-primary-nav');
			this.createSingleMenu(main, this.translation[this.lang === 'da' ? 'da' : 'en'].secondary, 'rdl-secondary-nav');
			const localeSwitcher: HTMLAnchorElement | null = this.shadow.querySelector('#localeSwitcher');
			localeSwitcher
				? localeSwitcher.addEventListener('click', (e) => {
						this.dispatchLocaleSwitch(e);
				  })
				: null;
		}
	}

	createSingleMenu(parent: HTMLElement, menu: Array<TranslationItem>, name: string) {
		const currentMenu = document.createElement('ul');
		currentMenu.setAttribute('role', 'menubar');
		currentMenu.classList.add(name);
		menu.forEach((el) => {
			this.createMenuElement(currentMenu, el.title, el.link, el.icon, el.id);
		});
		parent.appendChild(currentMenu);
	}

	createMenuElement(parent: HTMLUListElement, title: string, url: string, icon?: string, id?: string) {
		const listElem = document.createElement('li');
		const link = document.createElement('a');
		if (id) link.id = id;
		listElem.appendChild(link);
		link.classList.add('nav-item', 'level-1');
		link.textContent = title;
		link.href = url;
		if (icon) {
			const iconElem = document.createElement('i');
			iconElem.classList.add('material-icons');
			iconElem.setAttribute('aria-hidden', 'true');
			iconElem.innerText = icon;
			link.appendChild(iconElem);
		}
		parent.appendChild(listElem);
	}
}

const MENU_COMPONENT_TEMPLATE = /*html*/ `
	<header
	id="mainHeader"
	class="global-header"
>
	<div class="header-bg-wrapper rdl-theme-bg">
		<div class="container">
			<div class="row justify-content-between">
				<div class="col logo-col">
					<a
						href="#"
						class="rdl-logo"
					>
						<span class="sr-only"></span>
					</a>
				</div>
			</div>
			<div
				class="collapse rdl-main-navigation-wrapper"
				id="mobileNavigation"
				data-parent="#mainHeader"
			>
				<nav
					class="rdl-main-navigation"
					aria-label="Hovednavigation"
				>
				</nav>
			</div>
		</div>
	</div>

	<div class="header-edge d-none d-lg-inline-block"></div>
</header>
`;

const MENU_COMPONMENT_STYLES = /*css*/ `
	<style>
	a {
		font-weight: 700;
		color:#002e70;
		text-decoration:none;
		font-family: noway,sans-serif;
		text-transform:uppercase;
	}

	.container {
		display:flex;
		justify-content: space-between;
		padding-left:12px;
		padding-right:12px;
	}

	.rdl-main-navigation {
		display:flex;
		flex-direction: column-reverse;
	    align-items: flex-end;
	}
	.rdl-secondary-nav {
		font-size: .75rem;
	}

	.rdl-primary-nav {
		font-size: 1rem;
	}
	.material-icons {
		font-family: 'Material Icons';
		font-weight: normal;
		font-style: normal;
		font-size: 24px;
		line-height: 1;
		letter-spacing: normal;
		text-transform: none;
		display: inline-block;
		white-space: nowrap;
		word-wrap: normal;
		direction: ltr;
		-webkit-font-feature-settings: 'liga';
		-webkit-font-smoothing: antialiased;
	  }

	.global-header .header-bg-wrapper {
		padding-top: 24px;
		padding-bottom: 24px;
	}
	.global-header {
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 100;
		background-color: #caf0fe;
		font-family: noway,sans-serif;
	}
	
	.theme-blue .header-bg-wrapper.rdl-theme-bg {
		background-color: #caf0fe;
	}
	
	.justify-content-between {
		justify-content: space-between !important;
	}

	.nav-item.level-1 {
		line-height: 1.25rem;
		margin-left: 4px;
		margin-right: 4px;
		padding-bottom: 0;
		border-bottom: 2px solid transparent;
		display: table;
		margin-bottom: 10px;
		margin-top: 13px;
		padding: 0;
		transition: border-bottom-color .3s ease-in-out;
		white-space: nowrap;
	}
	li button {
		display:none;
		border:0;
		background-color:transparent;
		padding: 8px;
	}

	li button i {
		word-wrap: normal;
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
		-moz-osx-font-smoothing: grayscale;
		font-feature-settings: "liga";
		direction: ltr;
		display: inline-block;
		font-family: Material Icons,serif;
		font-size: 24px;
		font-style: normal;
		font-weight: 400;
		letter-spacing: normal;
		line-height: 1;
		text-transform: none;
		white-space: nowrap;
	}
	.rdl-primary-nav .icon-button[aria-expanded=false] i:after {
		content:'add';
	}

	.nav-item i {
		display: inline-block;
		position: relative;
		top: 3px;
		font-size: 17px;
	}

	.rdl-primary-nav, .rdl-secondary-nav {
		margin-bottom: 0;
    	margin-top: 0;
	}
	
	.row {
		display: flex;
		flex-wrap: wrap;
		/* margin-left: -12px;
		margin-right: -12px; */
	}
	
	.rdl-system-messages-wrapper {
		flex-direction: column;
		order: 3;
	}
	
	@media (min-width: 990px) {
		.global-header .header-edge {
			-webkit-clip-path: polygon(0 0, 100% 0, 100% calc(100% - 1.5vw), 0 100%);
			clip-path: polygon(0 0, 100% 0, 100% calc(100% - 1.5vw), 0 100%);
			height: 1.4vw;
			margin-bottom: -1.5vw;
		}
	}

	@media (min-width: 990px) {
		.rdl-primary-nav button, .rdl-secondary-nav button {
    		display: none;
		}
	}

	@media (min-width: 990px) {
		.d-lg-inline-flex {
    		display: inline-flex!important;
		}
	}

	@media (min-width: 990px) {
		.rdl-primary-nav ul,
		.rdl-secondary-nav ul {
			display: none;
		}
	}
	
	.rdl-primary-nav li,
	.rdl-secondary-nav li {
			display: inline-flex;
		}

	.logo-col {
		display: flex;
		align-content: center;
		flex-wrap: wrap;
	}

	.rdl-logo {
		background-image: url('https://design.kb.dk/components/assets/images/logo-digital.svg');
		background-position: 0;
		background-repeat: no-repeat;
		background-size: contain;
		display: inline-block;
		height: 32px;
		width: 138px;
	}
	@media (min-width: 990px) {
		.rdl-logo {
			background-image: url('https://design.kb.dk/components/assets/images/logo.svg');
			height: 69px;
			width: 174px;
		}
	}
	</style>`;

customElements.define('kb-menu', MenuComponent);
