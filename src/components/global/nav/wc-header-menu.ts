import gsap from 'gsap';

class MenuComponent extends HTMLElement {
	shadow: ShadowRoot;
	lang: string;
	translation: MenuTranslation;
	collapsed: boolean;
	constructor() {
		super();
		this.collapsed = true;
		this.translation = menuTranslations;
		this.lang = 'da';
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.innerHTML = MENU_COMPONENT_TEMPLATE + MENU_COMPONMENT_STYLES;

		const menuButton = this.shadow.querySelector('#mobileNavButton');
		if (menuButton) {
			menuButton.addEventListener('click', () => this.toggleMenu());
		}

		this.createFullHeaderMenu();
	}

	static get observedAttributes() {
		return ['locale'];
	}

	connectedCallback() {
		const vueRouting = this.getAttribute('vueRouting');
		const logo = this.shadow.querySelector('.rdl-logo');
		if (logo && vueRouting === 'true') {
			logo.addEventListener('click', (event) => {
				if (vueRouting) {
					event.preventDefault();
					window.dispatchEvent(
						new CustomEvent('change-path', {
							detail: { name: 'Home', query: { q: '' } },
						}),
					);
					window.dispatchEvent(new Event('reset-input'));
				}
			});
		}
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

	toggleMenu() {
		this.shadow.querySelector('#mobileNavButton')?.setAttribute('aria-expanded', this.collapsed.toString());
		const navigationWrapper = this.shadow.querySelector('.rdl-main-navigation-wrapper');
		if (this.collapsed) {
			navigationWrapper?.classList.toggle('collapse');
			navigationWrapper?.classList.toggle('show');
			this.collapsed = !this.collapsed;
			gsap.to(navigationWrapper, {
				height: 'auto',
				duration: 0.25,
				overwrite: false,
			});
		} else {
			this.collapsed = !this.collapsed;

			gsap.to(navigationWrapper, {
				height: '0px',
				duration: 0.25,
				overwrite: false,
				onComplete: () => {
					navigationWrapper?.classList.toggle('collapse');
					navigationWrapper?.classList.toggle('show');
				},
			});
		}
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

	createSingleMenu(parent: HTMLElement, menu: Array<MenuTranslationItem>, name: string) {
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
		listElem.role = 'none';
		const link = document.createElement('a');
		link.role = 'menuitem';
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

type MenuTranslationItem = {
	title: string;
	link: string;
	icon?: string;
	id?: string;
};

type MenuTranslation = {
	da: {
		primary: MenuTranslationItem[];
		secondary: MenuTranslationItem[];
	};
	en: {
		primary: MenuTranslationItem[];
		secondary: MenuTranslationItem[];
	};
};

const menuTranslations = {
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

const MENU_COMPONENT_TEMPLATE = /*html*/ `
<div class="overall-header">
	<header
	id="mainHeader"
	class="global-header"
>
	<div class="header-bg-wrapper rdl-theme-bg">
		<div class="container">
			<div class="row justify-content-between">
				<div class="col logo-col">
					<a
						href="/"
						class="rdl-logo"
						title="Logo of the Royal Danish Library"
					>
						<span class="sr-only"></span>
					</a>
				</div>
				<div class="col-auto d-lg-none burger-col">
					<div id="mobileNavToggle">
						<button id="mobileNavButton" class="btn rdl-burger collapsed" data-toggle="collapse" data-target="#mobileNavigation" aria-expanded="false" aria-controls="mobileNavigation" aria-label="Åbn eller luk navigation" aria-pressed="false">
							<span class="rdl-line" aria-hidden="true"></span>
							<span class="rdl-line" aria-hidden="true"></span>
							<span class="rdl-line" aria-hidden="true"></span>
							<span>Menu</span>
						</button>
					</div>
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
</header>
<div class="edge blue"></div>
</div>

`;

const MENU_COMPONMENT_STYLES = /*css*/ `
	<style>
	.edge {
		height:31px;
	}

	.overall-header {
		position:relative;
		z-index:2;
		margin-bottom:50px;
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

	.edge.blue {
		width:100%;
		position:absolute;
		background-color:#caf0fe;
		clip-path: polygon(0 0, 0 100%, 100% 0);
		z-index: 3;
	}
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
		width:100%;
	}

	.rdl-burger {
		background-color: transparent;
		border: none;
		float: right;
		cursor: pointer;
		padding: 0;
		font-size: 0.75rem;
		color: #002E70;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
		text-transform: uppercase;
		font-family: "noway",sans-serif;
	}

	.rdl-burger .rdl-line {
		width: 2rem;
		height: 4px;
		background-color: #002E70;
		display: block;
		margin: 3px 0;
		transition: all 0.3s ease-in-out;
		float: right;
	}

	.rdl-burger[aria-expanded=true] .rdl-line:nth-child(2) {
		width: 70%;
	}

	.rdl-burger[aria-expanded=true] .rdl-line:nth-child(3) {
		width: 40%;
	}

	.collapse .rdl-main-navigation {
		display:none;
	}


	.rdl-main-navigation {
		flex-direction: column;
   		 align-items: flex-start;
		display:flex;
	}
	.rdl-secondary-nav, .rdl-primary-nav {
		text-transform: uppercase;
		font-family: "noway",sans-serif;
		font-weight: 700;
		font-size: 1.25rem;
		line-height: 1.5rem;
		padding-top: 13px;
		padding-bottom: 13px;
		padding-left: 24px;
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

	.rdl-main-navigation-wrapper {
		z-index:5;
		height:0px;
		overflow: hidden;
	}

	.global-header .header-bg-wrapper {
		padding-top: 24px;
		padding-bottom: 24px;
	}
	.global-header {
		display: flex;
		flex-direction: column;
		position: relative;
		background-color: #caf0fe;
		font-family: noway,sans-serif;
	}
	
	.theme-blue .header-bg-wrapper.rdl-theme-bg {
		background-color: #caf0fe;
	}
	
	.justify-content-between {
		justify-content: space-between !important;
	}
	.header-bg-wrapper {
		display: flex;
		justify-content: center;
	}

	.nav-item.level-1 {
		line-height: 24px;
		margin-left: 4px;
		margin-right: 4px;
		padding-bottom: 0;
		border-bottom: 2px solid transparent;
		display: table;
		padding:13px 0px;
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
			list-style-type: none
	}

	.rdl-primary-nav, .rdl-secondary-nav {
		margin-bottom: 0;
    	margin-top: 0;
	}

	.container {
		display:flex;
		flex-direction:column;
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

		
	.logo-col {
		display: flex;
		align-content: center;
		flex-wrap: wrap;
		margin-left: 12px;
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

		.global-header .header-edge {
			-webkit-clip-path: polygon(0 0, 100% 0, 100% calc(100% - 1.5vw), 0 100%);
			clip-path: polygon(0 0, 100% 0, 100% calc(100% - 1.5vw), 0 100%);
			height: 1.4vw;
			margin-bottom: -1.5vw;
		}
		.container {
			flex-direction: row;
		}
		.logo-col {
			margin-left: 0px;
		}
		
		.rdl-main-navigation-wrapper {
			height:auto !important;
			display:flex !important;
		}
		
		.burger-col {
			display:none;
		}
		.rdl-secondary-nav {
			font-size: .75rem;
			padding-left: 0px;
			padding-top: 0px;
			padding-bottom: 0px;
		}
	
		.rdl-primary-nav {
			font-size: 1rem;
			padding-left: 0px;
			padding-top: 0px;
			padding-bottom: 0px;
		}

		.rdl-primary-nav button, .rdl-secondary-nav button {
    		display: none;
		}
		.d-lg-inline-flex {
    		display: inline-flex!important;
		}
		.rdl-primary-nav li,
		.rdl-secondary-nav li {
			display: inline-flex;
		}
		.rdl-primary-nav ul,
		.rdl-secondary-nav ul {
			display: none;
		}

		.rdl-main-navigation {
			display:flex;
			flex-direction: column-reverse;
			align-items: flex-end;
		}

		.nav-item.level-1 {
			padding:0px 0px;
			margin-top:13px;
			margin-bottom:13px;
			line-height: 1.25rem;
		}

		.rdl-secondary-nav .nav-item.level-1 {
			margin-right: 4px;
			margin-left: 4px;
			padding-bottom: 0;
			font-size: 0.75rem;
		}

		.rdl-primary-nav .nav-item.level-1 {
			margin-right: 8px;
    		margin-left: 8px;
    		font-size: 1rem;
		}

		.collapse .rdl-main-navigation {
			display:flex;
		}
		.rdl-logo {
			background-image: url('https://design.kb.dk/components/assets/images/logo.svg');
			height: 69px;
			width: 174px;
		}

		.edge.blue {
			top:unset;
		}
		.overall-header {
			margin-bottom:0px;
		}
		.container {
			display: flex;
			/* flex-direction: column; */
			max-width: 1150px;
		}
	}
	/* MEDIA QUERY 1150 */
	@media (min-width: 1150px) {
		.rdl-secondary-nav .nav-item.level-1 {
			line-height: 1.5rem;
			font-size: 0.875rem;
		}
		.rdl-primary-nav .nav-item.level-1 {
			padding-bottom: 2px;
			font-size: 1.25rem;
		}
		.container {
			max-width: 1280px;
		}
	}
	/* MEDIA QUERY 1280 */
	@media (min-width: 1280px) {
		.container {
			padding-right: 0;
			padding-left: 0;
		}
	}

	</style>`;

customElements.define('kb-menu', MenuComponent);
