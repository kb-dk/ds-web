class ResultComponent extends HTMLElement {
	constructor() {
		super().attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = TEMPLATE + STYLES;

		this.number = 0;
		this.resultData;

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					this.style.transitionDelay = this.number / 50 + 's';
					this.style.opacity = 1;
					this.style.transform = 'translateX(0px)';
					observer.disconnect();
				}
			});
		});

		observer.observe(this);
	}

	static get observedAttributes() {
		return ['data', 'number', 'hide'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'data') {
			this.resultData = JSON.parse(newValue);
			this.shadowRoot.querySelector('.title').textContent =
				this.shadowRoot.querySelector('.title').textContent + ' ' + this.resultData.title;
		}
		if (name === 'number') {
			this.number = newValue;
			this.shadowRoot.querySelector('.number').textContent = Number(Number(newValue) + 1) + ' | ';
		}
		if (name === 'hide') {
			this.style.opacity = 0;
			this.style.transform = 'translateX(-20px)';
		}
	}

	connectedCallback() {
		console.log('result component connected!');
	}
	disconnectedCallback() {
		console.log('result component removed');
	}
}

const TEMPLATE = /*html*/ `
	<div class="container">
		<span class="number"></span><span class="title">title: </span>
        <figure class="image-wrapper">
		<img
			class="image-item"
			:src="imgSrc"
			:alt="altTxt"
		/>
	</figure>
	</div>
`;

const STYLES = /*css*/ `
	<style>
		:host {
			display: block;
			opacity: 0;
			transition: all .2s linear;
            transform:translateX(20px);
		}
	</style>`;

customElements.define('kb-resultcomponent', ResultComponent);
