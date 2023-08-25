class checkboxComponent extends HTMLElement {
	constructor() {
		super().attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = TEMPLATE + STYLES;

		this.checkbox = this.shadowRoot.querySelector('.checkbox');

		this.checkbox.addEventListener('change', (e) => {
			console.log('changed', e.value);
			//window.dispatchEvent(new CustomEvent('query-update', { detail: { query: this.searchQuery.value } }));
		});
	}

	static get observedAttributes() {
		return ['value', 'title'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'value') {
			this.shadowRoot.querySelector('.checkbox').value = newValue;
			this.shadowRoot.querySelector('.label').for = newValue;
		}
		if (name === 'title') {
			this.shadowRoot.querySelector('.checkbox').id = newValue;
			this.shadowRoot.querySelector('.label').value = newValue;
		}
	}
}

const TEMPLATE = /*html*/ `
	<label for="" class="label"></label><input type="checkbox" class="checkbox">
	</div>
`;

const STYLES = /*css*/ `
	<style>
		:host {

		}
        .checkbox {

        }
        .checkbox :checked {

        }
        .checkbox :disabled {

        }
        .checkbox :hover {

        }
    </style>`;

customElements.define('kb-checkboxcomponent', checkboxComponent);
