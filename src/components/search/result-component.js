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
		return ['data', 'number', 'show'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'data') {
			this.resultData = JSON.parse(newValue);
			this.shadowRoot.querySelector('.title').textContent = Number(this.number + 1) + ' ' + this.resultData.title;
			this.shadowRoot.querySelector('.title').href = '/record/' + this.resultData.id; ///record/:id
			this.shadowRoot.querySelector('.where').textContent = 'KANAL';
			this.shadowRoot.querySelector('.when').textContent = 'TIDSPUNKT';
			this.shadowRoot.querySelector('.duration').textContent = 'VARIGHED';
			this.shadowRoot.querySelector('.summary').textContent =
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tristique nibh vel consectetur condimentum. Vestibulum dictum luctus nulla, eu aliquam arcu vehicula eget. Praesent tristique, tortor a posuere faucibus, urna odio aliquet massa, sit amet viverra eros magna et sapien. Suspendisse sodales porta erat, nec fermentum nisi.';
		}
		if (name === 'number') {
			this.number = newValue;
		}
		if (name === 'show') {
			if (newValue === true) {
				this.style.opacity = 1;
				this.style.transform = 'translateX(0px)';
			} else {
				this.style.opacity = 0;
				this.style.transform = 'translateX(-20px)';
			}
		}
	}
}

const TEMPLATE = /*html*/ `
	<div class="container">
		<div class="information">
			<a href="" class="title"></a>
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

const STYLES = /*css*/ `
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
