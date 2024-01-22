import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { ImageComponentType } from '@/types/ImageComponentType';

import '@/components/common/wc-image-item';

import gsap from 'gsap';

class ResultComponent extends HTMLElement {
	shadow: ShadowRoot;
	number: number | undefined;
	vueRouting: boolean | undefined;
	//resultdata: GenericSearchResultType | undefined;
	placeholder: string | undefined;
	data: GenericSearchResultType | undefined;
	savedStart: string | undefined;
	savedDuration: string | undefined;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.innerHTML = RESULT_COMPONENT_TEMPLATE + RESULT_COMPONENT_STYLES;

		/* 		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					this.style.transitionDelay = Number(this.number === undefined ? 0 : this.number) / 50 + 's';
					this.style.opacity = '1';
					this.style.transform = 'translateY(0px)';
					observer.disconnect();
				}
			});
		});

		observer.observe(this); */
	}

	static get observedAttributes() {
		return ['show', 'duration', 'starttime', 'resultdata'];
	}

	renderResultData(resultData: GenericSearchResultType) {
		const loading = this.shadow.querySelector('.loading') as HTMLDivElement;
		const container = this.shadow.querySelector('.container') as HTMLDivElement;
		if (resultData !== null) {
			this.data = resultData;
			this.addDataToContainer();
			gsap.to(loading, {
				opacity: 0,
				duration: 0.25,
				onComplete: () => {
					this.hideLoadingAndShowContent();
				},
			});
		} else {
			gsap.to(container, {
				opacity: 0,
				duration: 0.25,
				onComplete: () => {
					this.hideContentAndShowLoading();
				},
			});
		}
	}

	hideLoadingAndShowContent = () => {
		const loading = this.shadow.querySelector('.loading') as HTMLDivElement;
		loading && (loading.style.display = 'none');

		const container = this.shadow.querySelector('.container') as HTMLDivElement;
		container && (container.style.display = 'flex');
		gsap.to(container, {
			opacity: 1,
			delay: 0.01,
			duration: 0.25,
		});
	};

	hideContentAndShowLoading = () => {
		const container = this.shadow.querySelector('.container') as HTMLDivElement;
		container && (container.style.display = 'none');

		this.updateSkeletonDifferences();

		const loading = this.shadow.querySelector('.loading') as HTMLDivElement;
		const shimmer = this.shadow.querySelector('.shimmer') as HTMLDivElement;
		shimmer.style.animationDelay = Math.random() * 1 + 's';
		loading && (loading.style.display = 'flex');
		gsap.to(loading, {
			opacity: 1,
			delay: 0.01,
			duration: 0.25,
		});
	};

	private addDataToContainer() {
		if (this.data) {
			const title = this.shadow.querySelector('.title') as HTMLAnchorElement;
			const desc = this.shadow.querySelector('.summary') as HTMLDivElement;
			const tv = this.shadow.querySelector('.tv') as HTMLDivElement;
			const where = this.shadow.querySelector('.where') as HTMLDivElement;
			title.style.color = '#002E70';
			title && (title.href = 'record/' + this.data.id);
			title.addEventListener('click', (event) => {
				if (this.vueRouting) {
					event.preventDefault();
					const id = this.data !== undefined ? this.data.id : '';
					window.dispatchEvent(
						new CustomEvent('change-path', {
							detail: { path: 'record/' + id },
						}),
					);
				}
			});
			title && (title.textContent = this.data.title);
			desc && (desc.textContent = this.data.description);
			tv && (tv.textContent = this.data.origin.split('.')[1]);
			where && (where.textContent = this.data.creator_affiliation[0] + ',');
			const imageComponent = this.shadow.querySelector('kb-imagecomponent') as ImageComponentType;
			if (imageComponent) {
				imageComponent.imgSrc = this.data.thumbnail;
				imageComponent.altText = this.data.title;
				imageComponent.imgTitle = this.data.title;
				imageComponent.placeholder = this.placeholder;
			}
		}
	}

	private updateSkeletonDifferences() {
		const title = this.shadow.querySelector('.placeholder-t') as HTMLDivElement;
		const subtitle = this.shadow
			.querySelector('.placeholder-w')
			?.querySelectorAll('span') as NodeListOf<HTMLSpanElement>;
		const summary = this.shadow
			.querySelector('.placeholder-s')
			?.querySelectorAll('span') as NodeListOf<HTMLSpanElement>;

		title.style.width = Math.random() * 30 + 30 + '%';

		subtitle.forEach((item) => {
			item.style.width = Math.random() * 10 + 10 + '%';
		});

		summary.forEach((item) => {
			item.style.width = Math.random() * 12 + 12 + '%';
		});
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === 'resultdata') {
			this.renderResultData(JSON.parse(newValue));
		}
		if (name === 'duration') {
			const duration = this.shadow.querySelector('.duration');
			if (duration && newValue !== undefined && newValue !== null && newValue !== '') {
				duration.textContent = newValue;
			}
		}
		if (name === 'starttime') {
			const when = this.shadow.querySelector('.when');
			if (when && newValue !== undefined && newValue !== null && newValue !== '') {
				when.textContent = newValue;
			}
		}
	}
}

const RESULT_COMPONENT_TEMPLATE = /*html*/ `
	<div>
		<div class="container">
			<div class="information">
			<a role="link" class="title"></a>
			<div class="subtitle">
				<span class="material-icons icons tv"></span>
				<span class="where"></span>
				<span class="when"></span>
				<span class="material-icons icons schedule"></span>
				<span class="duration"></span>
			</div>
				<div class="summary">
				</div>
			</div>
			<div class="result-image-wrapper"><kb-imagecomponent></kb-imagecomponent></div>	
		</div>
		<div class="loading">
			<div class="shimmer"></div>
			<div class="information">
				<div class="placeholder-t"></div>
				<div class="placeholder-w"><span></span><span></span></div>
				<div class="placeholder-s">
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
				</div>
			</div>
			<div class="result-image-wrapper skeleton"></div>
		
		</div>
	</div>
`;

const RESULT_COMPONENT_STYLES = /*css*/ `
	<style>
		:host {
			display: block;
			transition: all .3s linear;
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
		},

		.tv, .schedule {
			transition: all .5s ease-in-out 0s;
		}

		.summary span {
			height:15px;
			display:block;
			border-radius:15px;
			margin-top:5px;
			transition: all .5s ease-in-out 0s;

		}

		.container {
			display: none;
			opacity: 0;
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
			transition: all 0.5s ease-in-out 0s;
			font-weight:bold;
			color: #002E70;
			text-overflow: ellipsis;
			max-width:calc(100% - (200px - 60px));
			white-space: nowrap;
			overflow: hidden;
			width: 75ch;
			text-transform:uppercase;
			text-decoration:none;
			height:18px;
			position: relative;
			display: block;
			margin-bottom: 7px;
		}

		.result-image-wrapper {
			width:200px;
		}

		.where, .when, .duration {
			padding-right:5px;
			text-overflow: ellipsis;
			font-size:14px;
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
			mix-blend-mode: soft-light;
			overflow:hidden;
			background-size: 200% 100%;
			background-position: 160% center;
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

		.placeholder-t {
			border-radius: 105px;
			background-color:rgba(170,170,170,1);
			height:20px;
			margin-bottom:7px;

		}

		.placeholder-w span {
			display:inline-block;
			border-radius: 10px;
			background-color:rgba(170,170,170,1);
			width:30px;
			height:16px;
			width:25%;
		}

		.placeholder-w span:first-of-type {
			margin-right:5px;
		}

		.placeholder-s {
			height:60px;
			width:100%;
		}

		.result-image-wrapper.skeleton {
			background-color:rgba(170,170,170,1);
			border-radius:10px;
		}

		.placeholder-s span {
			display:inline-block;
			border-radius: 10px;
			background-color:rgba(170,170,170,1);
			height:14px;
			line-height: 20px;        /* fallback for firefox */
			max-height: calc(20px);	/* fallback for firefox */
			width:90%;
		}

		.summary {
			transition: all 0.5s ease-in-out 0s;
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
