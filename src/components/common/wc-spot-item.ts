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
			//No data yet, so it's just filler
			imageComponent.imgSrc = '';
			imageComponent.altText = 'alt text here';
			imageComponent.imgTitle = 'title here';
			imageComponent.aspect = '2/1.25';
			imageComponent.icon = 'play_arrow';
		}
	}

	static get observedAttributes() {
		return ['locale'];
	}

	connectedCallback() {
		//TODO: We're waiting for real data here
		if (this.data) {
			const titleHolder = this.shadow.querySelector('.record-title');
			titleHolder && (titleHolder.innerHTML = this.data.title);
			const symbol = this.shadow.querySelector('.type-symbol');
			symbol && (symbol.innerHTML = 'play_arrow');
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
        display:inline-block;
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

    a:hover .image-wrapper {
        transform-origin:center;
        filter:hue-rotate(3.142rad);
    }

    a:hover .image-item {
        transform:scale(1.1);
    }
	</style>`;

customElements.define('kb-spotcomponent', SpotComponent);
