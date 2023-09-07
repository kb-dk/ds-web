class checkboxComponent extends HTMLElement {
	constructor() {
		super().attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = TEMPLATE + STYLES;

		this.slide = 0;
		this.key = '';
		this.sendValue = '';

		this.checkbox = this.shadowRoot.querySelector('.checkbox');

		this.checkbox.addEventListener('change', (e) => {
			window.dispatchEvent(
				new CustomEvent('filter-update', {
					detail: { filter: `fq=${this.key}:"${this.sendValue}"`, add: e.target.checked },
				}),
			);
		});

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					this.style.transitionDelay = this.slide / 50 + 's';
					this.style.opacity = 1;
					this.style.transform = 'translateY(0px)';
					observer.disconnect();
				}
			});
		});

		observer.observe(this);
	}

	static get observedAttributes() {
		return ['fqkey', 'value', 'title', 'number', 'inslide', 'show'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'value') {
			if (newValue === 'false') {
				this.shadowRoot.querySelector('.checkbox').checked = false;
				this.shadowRoot.querySelector('.checkbox').ariaChecked = false;
			} else {
				this.shadowRoot.querySelector('.checkbox').checked = true;
				this.shadowRoot.querySelector('.checkbox').ariaChecked = true;
			}
		}
		if (name === 'title') {
			this.sendValue = newValue;
			this.shadowRoot.querySelector('.checkbox').id = newValue;
			this.shadowRoot.querySelector('.title').innerText = newValue;
			this.shadowRoot.querySelector('.label').htmlFor = newValue;
		}
		if (name === 'number') {
			this.shadowRoot.querySelector('.number').innerText = '(' + newValue + ')';
		}
		if (name === 'fqkey') {
			this.key = newValue;
		}
		if (name === 'inslide') {
			this.slide = newValue;
		}
		if (name === 'show') {
			if (newValue === true) {
				this.style.opacity = 1;
				this.style.transform = 'translateY(0px)';
			} else {
				this.style.opacity = 0;
				this.style.transform = 'translateY(-20px)';
			}
		}
	}
}

const TEMPLATE = /*html*/ `
    <div class="container">
        <label class="label"><span class="title"></span><span class="number"></span></label>
        <input role="checkbox" tabindex="0" type="checkbox" class="checkbox">
	</div>
`;

const STYLES = /*css*/ `
	<style>
		:host { 
            display: block;
			opacity: 0;
			transition: all 0.3s linear;
            transform:translateY(20px);
            height:25px;
            width:100%;
            margin-right:5px;
		}

        .container {
            display:flex;
            justify-content: space-between;
        }

        .number {
            font-size:10px;
            color:rgba(130,130,130,1);
            display:inline-block;
            padding-left:5px;
            vertical-align: bottom;
            line-height: 24px;
            height: 100%;
        }

        .title {
            font-size:14px;
            text-overflow: ellipsis;
            max-width: calc(100% - 38px);
            white-space: nowrap;
            overflow: hidden;
            display: inline-block;
        }
        .checkbox {
            float:right;
            --active: #275EFE;
            --active-inner: #fff;
            --focus: 2px rgba(39, 94, 254, .3);
            --border: rgba(30,30,30,0);
            --border-hover: #002E70;
            --background: rgba(30,30,30,0.4);
            --disabled: #F6F8FF;
            --disabled-inner: #E1E6F9;
            -webkit-appearance: none;
            -moz-appearance: none;
            height: 21px;
            outline: none;
            display: inline-block;
            vertical-align: top;
            position: relative;
            margin: 0;
            cursor: pointer;
            border: 1px solid var(--bc, var(--border));
            background: var(--b, var(--background));
            transition: background .3s, border-color .3s, box-shadow .2s;
            width: 38px;
            border-radius: 11px;
        }
        .checkbox:hover:after {
            background-color:#fff6c4;
        } 
        input:focus {
            box-shadow: 0 0 0 2px rgba(39, 94, 254, 0.5);
        }

        .checkbox:checked {
            --background: #002E70;
        }
        .checkbox:after {
            content:'';
            display:block;
            position:absolute;
            width:15px;
            height:15px;
            top:2px;
            left:1px;
            background-color:#e9ecef;
            border-radius:180px;
            transition: all .3s ease-in-out;
        }
        .checkbox:checked:after {
            transform:translateX(19px);

        }
        .label {
            cursor:pointer;
            width: calc(100% - 38px);

        }
    </style>`;

customElements.define('kb-checkboxcomponent', checkboxComponent);
