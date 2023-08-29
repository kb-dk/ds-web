class DesktopComponent extends HTMLElement {
	shadow: ShadowRoot;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.innerHTML = DESKTOP_COMPONENT_TEMPLATE + DESKTOP_COMPONMENT_STYLES;

		/* const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					this.style.opacity = '1';
					observer.disconnect();
				}
			});
		});

		observer.observe(this); */
	}

	static get observedAttributes() {
		return [''];
	}
	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === '') {
			//console.log("something")
		}
	}
}

const DESKTOP_COMPONENT_TEMPLATE = /*html*/ `
	<div class="container main-12">
		<div class="row">
			<div class="col">
			</div>
		</div>
	</div>
`;

const DESKTOP_COMPONMENT_STYLES = /*css*/ `
	<style>
	</style>`;

customElements.define('kb-header', DesktopComponent);
