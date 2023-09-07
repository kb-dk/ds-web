class ResultComponent extends HTMLElement {
	shadow: ShadowRoot;
	number: number | undefined;
	vueRouting: boolean | undefined;
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.innerHTML = RESULT_COMPONENT_TEMPLATE + RESULT_COMPONENT_STYLES;

		const imageWrapper: HTMLDivElement | null = this.shadow.querySelector('.image-wrapper');
		const image: HTMLImageElement | null = this.shadow.querySelector('.image-item');
		if (image && imageWrapper) {
			image.addEventListener('load', this.showImage);
		}

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					this.style.transitionDelay = Number(this.number === undefined ? 0 : this.number) / 50 + 's';
					this.style.opacity = '1';
					this.style.transform = 'translateY(0px)';
					observer.disconnect();
				}
			});
		});

		observer.observe(this);
	}

	static get observedAttributes() {
		return ['data', 'number', 'show', 'vueRouting'];
	}

	showImage() {
		this.style.opacity = '1';
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === 'data') {
			const resultData = JSON.parse(newValue);
			const title = this.shadow.querySelector('.title') as HTMLAnchorElement;
			title && (title.href = 'record/' + resultData.id); // /record/:id
			title.addEventListener('click', (event) => {
				if (this.vueRouting) {
					event.preventDefault();
					window.dispatchEvent(
						new CustomEvent('change-path', {
							detail: { path: 'record/' + resultData.id },
						}),
					);
				}
			});
			title && (title.textContent = resultData.title);

			const where = this.shadow.querySelector('.where');
			where && (where.textContent = 'KANAL');

			const when = this.shadow.querySelector('.when');
			when && (when.textContent = 'TIDSPUNKT');

			const duration = this.shadow.querySelector('.duration');
			duration && (duration.textContent = 'VARIGHED');

			const thumb = this.shadow.querySelector('.image-item') as HTMLImageElement;
			thumb && (thumb.src = resultData.thumbnail);

			const summary = this.shadow.querySelector('.summary');
			summary &&
				(summary.textContent =
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tristique nibh vel consectetur condimentum. Vestibulum dictum luctus nulla, eu aliquam arcu vehicula eget. Praesent tristique, tortor a posuere faucibus, urna odio aliquet massa, sit amet viverra eros magna et sapien. Suspendisse sodales porta erat, nec fermentum nisi.');
		}
		if (name === 'number') {
			const number = this.shadow.querySelector('number');
			this.number = Number(newValue);
			number && (number.textContent = Number(newValue + 1).toString());
		}
		if (name === 'show') {
			if (newValue === 'false') {
				this.style.opacity = '0';
				this.style.transform = 'translateY(-20px)';
			} else {
				/* 				this.style.opacity = '1';
				this.style.transform = 'translateY(0px)'; */
			}
		}
		if (name === 'vueRouting') {
			newValue === 'true' ? (this.vueRouting = true) : (this.vueRouting = false);
		}
	}
}

const RESULT_COMPONENT_TEMPLATE = /*html*/ `
	<div class="container">
		<div class="information">
		<a role="link" class="title"></a>
		<div class="subtitle">
			<span class="material-icons icons">tv</span>
			<span class="where"></span>
			<span class="when"></span>
			<span class="material-icons icons">schedule</span>
			<span class="duration"></span>
		</div>
			<div class="summary"></div>
		</div>
        <figure class="image-wrapper">
			<img
				loading = "lazy"
				class="image-item"
				src=""
				alt="altTxt"
			/>
		</figure>
	</div>
`;

const RESULT_COMPONENT_STYLES = /*css*/ `
	<style>
		:host {
			display: block;
			opacity: 0;
			transition: all .3s linear;
            transform:translateY(-20px);
			padding-bottom:30px;
			overflow:hidden;
		}

		.material-icons {
			font-family: 'Material Icons';
			font-weight: normal;
			font-style: normal;
			font-size: 16px;
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
		.icons {
			padding-right:3px;
			position:relative;
			top:3px;
		}

		.container {
			display: flex;
			flex-direction: row;
			height:100px;
			justify-content: space-between;
			gap:30px;
			width:100%;
		}

		.information {
			text-overflow: ellipsis;
			width:calc(100% - (20% + 30px));
			overflow:hidden;
			max-width:100%;
		}

		.title {
			font-weight:bold;
			color: #002E70;
			text-overflow: ellipsis;
			max-width:calc(100% - (20% - 60px));
			white-space: nowrap;
			overflow: hidden;
			width: 75ch;
			text-transform:uppercase;
			text-decoration:none;
			padding-bottom:5px;
			
		}

		.image-wrapper {
			background: linear-gradient(45deg, #caf0fe, #fff6c4);
			width:20%;
			padding:0px;
			margin-block-start: 0em;
			margin-block-end: 0em;
			margin-inline-start: 0px;
			margin-inline-end: 0px;
		}

		.image-item {
			width:100%;
			height:100%;
			max-height:160px;
			object-fit:cover;
			transition:opacity 0.5s ease-in-out 0s;
			opacity:0;
		}

		.where, .when, .duration {
			padding-right:15px;
			text-overflow: ellipsis;
			font-size:14px;
		}
		.summary {
			overflow: hidden;
			display: -webkit-box;
			-webkit-line-clamp: 3;
					line-clamp: 3; 
			-webkit-box-orient: vertical;			
		}
	</style>`;

customElements.define('kb-resultcomponent', ResultComponent);
