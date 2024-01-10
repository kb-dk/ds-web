class checkboxComponent extends HTMLElement {
	shadow: ShadowRoot;
	slide: string | undefined;
	key: string | undefined;
	sendValue: string | undefined;
	checkbox: HTMLElement | null;
	savedTitle: string | undefined;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.innerHTML = TEMPLATE + STYLES;

		this.slide = '0';
		this.key = '';
		this.sendValue = '';

		this.checkbox = this.shadow.querySelector('.checkbox');

		this.checkbox
			? this.checkbox.addEventListener('change', (e: Event) => {
					const elem = e.target as HTMLInputElement;
					window.dispatchEvent(
						new CustomEvent('filter-update', {
							detail: {
								filter: `${this.key}:"${this.sendValue}"`,
								add: e.target !== null ? elem.checked : null,
							},
						}),
					);
				})
			: null;

		/* const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					this.style.transitionDelay = Number(this.slide) / 50 + 's' || 0 + 's';
					this.style.opacity = '1';
					this.style.transform = 'translateY(0px)';
					observer.disconnect();
				}
			});
		});

		observer.observe(this); */
	}

	static get observedAttributes() {
		return ['fqkey', 'value', 'title', 'number', 'inslide', 'show'];
	}

	hideLoadingAndShowContent = () => {
		const loading = this.shadow.querySelector('.loading') as HTMLDivElement;
		loading.removeEventListener('transitionend', this.hideLoadingAndShowContent);
		this.loadingRemoved();
		this.containerRevealed();
	};

	hideContentAndShowLoading = () => {
		const container = this.shadow.querySelector('.checkbox-container') as HTMLDivElement;
		container.removeEventListener('transitionend', this.hideContentAndShowLoading);
		this.containerRemoved();
		this.updateSkeletonDifferences();
		this.loadingRevealed();
	};

	private loadingRemoved() {
		const loading = this.shadow.querySelector('.loading') as HTMLDivElement;
		loading && (loading.style.display = 'none');
	}

	private loadingRevealed() {
		const loading = this.shadow.querySelector('.loading') as HTMLDivElement;
		const shimmer = this.shadow.querySelector('.shimmer') as HTMLDivElement;
		shimmer.style.animationDelay = Math.random() * 1 + 's';
		loading && (loading.style.display = 'flex');
		setTimeout(() => {
			loading.style.opacity = '1';
		}, 100);
	}

	private containerRemoved() {
		const container = this.shadow.querySelector('.checkbox-container') as HTMLDivElement;
		container && (container.style.display = 'none');
	}

	private containerRevealed() {
		const container = this.shadow.querySelector('.checkbox-container') as HTMLDivElement;
		container && (container.style.display = 'flex');
		setTimeout(() => {
			container.style.opacity = '1';
		}, 100);
	}

	private updateSkeletonDifferences() {
		const texts = this.shadow
			.querySelectorAll('.text') as NodeListOf<HTMLSpanElement>;

			texts.forEach((item) => {
			item.style.width = Math.random() * 12 + 12 + '%';
		});
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === 'value') {
			const checkbox = this.shadow.querySelector('.checkbox') as HTMLInputElement;
			if (checkbox !== null) {
				if (newValue === 'false') {
					checkbox.checked = false;
					checkbox.ariaChecked = 'false';
				} else {
					checkbox.checked = true;
					checkbox.ariaChecked = 'true';
				}
			}
		}
		if (name === 'title') {
			const loading = this.shadow.querySelector('.loading') as HTMLDivElement;
			const container = this.shadow.querySelector('.checkbox-container') as HTMLDivElement;
			if (newValue !== null && newValue !== undefined) {
				console.log("we doing spinner now");
				this.savedTitle = newValue;
				this.sendValue = newValue;
				const checkbox = this.shadow.querySelector('.checkbox') as HTMLElement;
				checkbox.id = newValue;

				const title = this.shadow.querySelector('.title') as HTMLElement;
				const label = this.shadow.querySelector('.label') as HTMLLabelElement;

				if(this.savedTitle) {
					title.innerText = this.savedTitle;
					label.htmlFor = this.savedTitle;

				}

				loading.addEventListener('transitionend', this.hideLoadingAndShowContent);
				container.removeEventListener('transitionend', this.hideContentAndShowLoading);
				loading.style.opacity = '0';
			} else {
				container.addEventListener('transitionend', this.hideContentAndShowLoading);
				loading.removeEventListener('transitionend', this.hideLoadingAndShowContent);
				container.style.opacity = '0';
	
			}
		}
		if (name === 'number') {
			const number = this.shadow.querySelector('.number') as HTMLElement;
			number.innerText = '(' + newValue + ')';
		}
		if (name === 'fqkey') {
			this.key = newValue;
		}
		if (name === 'inslide') {
			this.slide = newValue;
		}
		/* if (name === 'show') {
			if (newValue === 'false') {
				this.style.opacity = '0';
				this.style.transform = 'translateY(-20px)';
			}
		} */
	}
}

const TEMPLATE = /*html*/ `
    <div class="container">
			<div class="checkbox-container">
        <label class="label"><span class="title"></span><span class="number"></span></label>
        <input role="checkbox" tabindex="0" type="checkbox" class="checkbox">
			</div>
			<div class="loading">
				<div class="shimmer"></div>
					<span class="text"></span>
					<span class="text"></span>
					<span class="text"></span>
					<input disabled role="checkbox" tabindex="0" type="checkbox" class="checkbox">
			</div>
	</div>
`;

const STYLES = /*css*/ `
	<style>
		:host {
      display: block;
			opacity: 1;
			transition: all 0.3s linear;
			/* transform:translateY(-20px);*/
      height:25px;
      width:100%;
      margin-right:5px;
		}
		
		.loading {
			width:100vw;
			max-width:100%;
			height:105px;
			display:none;

			flex-direction: row;
			height: 105px;
			justify-content: space-between;
			gap: 30px;
		}

		.shimmer {
			animation: loading 3s ease-in-out 0s infinite;
			background: rgb(255,255,255);
			background: linear-gradient(117deg, rgba(255,255,255,0) 44%, rgba(255,255,255,0.7455357142857143) 64%, rgba(255,255,255,0) 77%);
			position: absolute;
			width: 100%;
			height: 105px;
			mix-blend-mode: lighten;
			overflow:hidden;
			background-size: 200% 100%;
			background-position: 160% center;
		}
		
		.shimmer-movement {
			position: absolute;
			width: 100%;
			height: 105px;
		}

		@keyframes loading {
			0% {
				background-position: 160% center;
			}
			20% {
				background-position: 160% center;
			}
			80% {
				background-position: -20% center;
			}
			100% {
				background-position: -20% center;
			}
		}

        .checkbox-container {
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
