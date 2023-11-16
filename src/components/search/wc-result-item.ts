import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { ImageComponentType } from '@/types/ImageComponentType';

import '@/components/common/wc-image-item';

class ResultComponent extends HTMLElement {
	shadow: ShadowRoot;
	number: number | undefined;
	vueRouting: boolean | undefined;
	resultData: GenericSearchResultType | undefined;
	placeholder: string | undefined;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.innerHTML = RESULT_COMPONENT_TEMPLATE + RESULT_COMPONENT_STYLES;

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
		return ['show', 'duration', 'starttime'];
	}

	connectedCallback() {
		if (this.resultData) {
			this.renderResultData(this.resultData);
		}
	}

	renderResultData(resultData: GenericSearchResultType) {
		const title = this.shadow.querySelector('.title') as HTMLAnchorElement;
		title && (title.href = 'record/' + resultData.id);
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
		if (where && resultData.creator_affiliation) {
			where.textContent = resultData.creator_affiliation[0] + ',';
		}

		const summary = this.shadow.querySelector('.summary');
		summary &&
			(summary.textContent =
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tristique nibh vel consectetur condimentum. Vestibulum dictum luctus nulla, eu aliquam arcu vehicula eget. Praesent tristique, tortor a posuere faucibus, urna odio aliquet massa, sit amet viverra eros magna et sapien. Suspendisse sodales porta erat, nec fermentum nisi.');

		const imageComponent = this.shadow.querySelector('kb-imagecomponent') as ImageComponentType;
		if (imageComponent) {
			imageComponent.imgSrc = resultData.thumbnail;
			imageComponent.altText = resultData.title;
			imageComponent.imgTitle = resultData.title;
			imageComponent.placeholder = this.placeholder;
		}
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === 'duration') {
			const duration = this.shadow.querySelector('.duration');

			if (duration && newValue !== undefined) {
				duration.textContent = newValue;
			}
		}
		if (name === 'starttime') {
			const when = this.shadow.querySelector('.when');
			if (when && newValue !== undefined) {
				when.textContent = newValue;
			}
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
	}
}

const RESULT_COMPONENT_TEMPLATE = /*html*/ `
	<div class="container">
		<div class="information">
		<a role="link" class="title"></a>
		<div class="subtitle">
			<span class="material-icons icons tv">tv</span>
			<span class="where"></span>
			<span class="when"></span>
			<span class="material-icons icons schedule">schedule</span>
			<span class="duration"></span>
		</div>
			<div class="summary"></div>
		</div>
        <div class="result-image-wrapper"><kb-imagecomponent></kb-imagecomponent></div>	
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
			height:105px;
			justify-content: space-between;
			gap:30px;
			width:100%;
		}

		.information {
			text-overflow: ellipsis;
			width:calc(100% - (200px + 30px));
			overflow:hidden;
			max-width:100%;
		}

		.title {
			font-weight:bold;
			color: #002E70;
			text-overflow: ellipsis;
			max-width:calc(100% - (200px - 60px));
			white-space: nowrap;
			overflow: hidden;
			width: 75ch;
			text-transform:uppercase;
			text-decoration:none;
			padding-bottom:5px;
			
		}
		.result-image-wrapper {
			width:200px;
		}

		.where, .when, .duration {
			padding-right:5px;
			text-overflow: ellipsis;
			font-size:14px;
		}

		.where:empty, .when:empty, .duration:empty {
			padding:0px;
		}
		.summary {
			overflow: hidden;
			display: -webkit-box;
			-webkit-line-clamp: 3;
					line-clamp: 3; 
			-webkit-box-orient: vertical;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			line-height: 20px;        /* fallback for firefox */
			max-height: calc(20px * 3);	/* fallback for firefox */
		}
	</style>`;

customElements.define('kb-resultcomponent', ResultComponent);
