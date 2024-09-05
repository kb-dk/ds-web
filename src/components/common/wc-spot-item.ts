import { ImageComponentType } from '@/types/ImageComponentType';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';

import '@/components/common/wc-image-item';

class SpotComponent extends HTMLElement {
	shadow: ShadowRoot;
	data: GenericSearchResultType | undefined;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.innerHTML = SPOT_COMPONMENT_TEMPLATE + SPOT_COMPONMENT_STYLES;

		const imageComponent = this.shadow.querySelector('kb-imagecomponent') as ImageComponentType;
		if (imageComponent) {
			const imageData = {} as ImageComponentType;
			//No data yet, so it's just filler
			imageData.imgSrc = '';
			imageData.imgOption = 'cover';
			// Test placeholder. Should never make it into production. Should be removed when we get this ready for prod.
			imageData.placeholder = 'https://design.kb.dk/components/assets/images/sourcesets/6/630x415px_b.jpg';
			imageData.altText = 'alt text here';
			imageData.imgTitle = 'title here';
			imageData.aspect = '2/1.25';
			imageData.icon = 'play_circle_filled';
			imageData.iconColor = 'white';
			imageComponent.setAttribute('imagedata', JSON.stringify(imageData));
		}
	}

	static get observedAttributes() {
		return ['locale'];
	}

	connectedCallback() {
		//TODO: We're waiting for real data here
		if (this.data) {
			console.log(this.data);
			if (this.data.title) {
				const titleHolder = this.shadow.querySelector('.record-title');
				titleHolder && (titleHolder.innerHTML = this.data.title);
			}
			const symbol = this.shadow.querySelector('.type-symbol');
			symbol && (symbol.innerHTML = 'play_circle_filled');
		}
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === 'locale') {
			this.lang = newValue;
		}
	}
}

const SPOT_COMPONMENT_TEMPLATE = /*html*/ `
    <a draggable="false" class="spot-wrapper" href="#">
        <div class="spot-component">
            <kb-imagecomponent></kb-imagecomponent>
            <div class="record-info">
                <div class="record-metadata">
                    <div><span class="material-icons">event</span><span>DR1, 7. september 1993</span></div>
                    <div><span class="material-icons">schedule</span>Varighed: <span>16min</span></div>
                </div>
                <h3 class="record-title">Placeholder</h3>
                <div class="record-summary">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec accumsan arcu. 
                    Fusce fermentum lorem eget mi egestas facilisis. Etiam at malesuada turpis. 
                    Sed scelerisque at ex ut mattis. Nam et porttitor sapien. Donec consectetur libero lectus, 
                    vitae facilisis orci maximus vel. Nam ligula erat, bibendum vitae faucibus quis, fringilla at est. 
                    Aenean porttitor nibh mi, nec vehicula risus condimentum commodo. Morbi at tortor diam. Sed sem dui, 
                    iaculis id gravida quis, pretium in enim. Mauris consectetur diam quam. Vestibulum sed auctor turpis, 
                    sed egestas felis. Suspendisse faucibus ullamcorper tortor vel cursus.
                </div>
            </div>
	    </div>
    </a>

`;

const SPOT_COMPONMENT_STYLES = /*css*/ `
	<style>
    .record-metadata {
        padding-top:20px;
    }

    a {
        text-decoration:none;
        color:black;
        margin-bottom:40px;
        display:block;
        transition:all 0.3s ease-in-out 0s;
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
        position:relative;
        top:3px;
    }

    .record-title {
        color: #002E70
    }

    .record-summary {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
                line-clamp: 3;
        -webkit-box-orient: vertical;
    }

    a figure {
        background-color:red;
    }

    .spot-component:hover kb-imagecomponent {
        --image-item-scale: 1.03;
		--image-item-hue-rotation: 3.142rad;
    }

	</style>`;

customElements.define('kb-spotcomponent', SpotComponent);
