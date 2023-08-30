class ResultComponent extends HTMLElement {
	shadow: ShadowRoot;
	number: number | undefined;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.innerHTML = RESULT_COMPONENT_TEMPLATE + RESULT_COMPONENT_STYLES;

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					this.style.transitionDelay = Number(this.number === undefined ? 0 : this.number) / 50 + 's';
					this.style.opacity = '1';
					this.style.transform = 'translateX(0px)';
					observer.disconnect();
				}
			});
		});

		observer.observe(this);
	}

	static get observedAttributes() {
		return ['data', 'number', 'show'];
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === 'data') {
			const resultData = JSON.parse(newValue);
			const title = this.shadow.querySelector('.title');
			title && (title.textContent = resultData.title);

			const where = this.shadow.querySelector('.where');
			where && (where.textContent = 'KANAL');

			const when = this.shadow.querySelector('.when');
			when && (when.textContent = 'TIDSPUNKT');

			const duration = this.shadow.querySelector('.duration');
			duration && (duration.textContent = 'VARIGHED');

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
			if (newValue === 'true') {
				this.style.opacity = '1';
				this.style.transform = 'translateX(0px)';
			} else {
				this.style.opacity = '0';
				this.style.transform = 'translateX(-20px)';
			}
		}
	}
}

const RESULT_COMPONENT_TEMPLATE = /*html*/ `
	<div class="container">
		<div class="information">
			<div class="title"></div>
			<div class="subtitle"><span class="where"></span><span class="when"></span><span class="duration"></span></div>
			<div class="summary"></div>
		</div>
        <figure class="image-wrapper">
			<img
				class="image-item"
				src="http://devel11.statsbiblioteket.dk:10001/ds-image/v1/IIP/?FIF=%2FDAMJP2%2FDAM%2FMaps%2F0000%2F067%2F807%2Fdk001991&ROT=0&CVT=jpeg"
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
			transition: all .2s linear;
            transform:translateX(20px);
			padding-bottom:30px;
			overflow:hidden;
		}

		.container {
			display: flex;
			flex-direction: row;
			height:90px;
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
			
		}

		.image-wrapper {
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
		}

		.where, .when, .duration {
			padding-right:15px;
			text-overflow: ellipsis;
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
