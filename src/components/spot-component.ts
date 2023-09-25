import { SpotType } from '../types/SpotType';

class SpotComponent extends HTMLElement {
	shadow: ShadowRoot;
	data: SpotType | undefined;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.innerHTML = ACCORDION_COMPONMENT_TEMPLATE + ACCORDION_COMPONMENT_STYLES;
	}

	static get observedAttributes() {
		return ['locale'];
	}

	connectedCallback() {
		if (this.data) {
			const titleHolder = this.shadow.querySelector('.record-title');
			titleHolder && (titleHolder.innerHTML = this.title);
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

const ACCORDION_COMPONMENT_TEMPLATE = /*html*/ `
    <a href="#">
        <div class="spot-component">
        <figure class="image-wrapper">
            <img
                loading = "lazy"
                class="image-item"
                src=""
                alt="altTxt"
            /><span class="type-symbol material-icons"></span>
        </figure>
            <div class="record-info">
                <div class="record-metadata">
                    <div><span class="material-icons">event</span><span>DR1, 7. september 1993</span></div>
                    <div><span class="material-icons">schedule</span>Varighed: <span>16min</span></div>
                </div>
                <h3 class="record-title"></h3>
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

const ACCORDION_COMPONMENT_STYLES = /*css*/ `
	<style>
    .record-metadata {
        padding-top:20px;
    }

    a { 
        text-decoration:none;
        color:black;
        margin-bottom:40px;
        display:inline-block;
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
    
    .type-symbol {
        font-size:64px !important;
        position: absolute !important;
        left: 50% !important;
        top: 50% !important;
        transform: translate(-50%, -50%);
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

    .image-wrapper {
        background: linear-gradient(45deg, #caf0fe, #fff6c4);
        aspect-ratio: 2/1.25;
        width:100%;
        padding:0px;
        margin-block-start: 0em;
        margin-block-end: 0em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        transition:all 0.3s ease-in-out 0s;
        filter:hue-rotate(0rad);
    }

    a:hover .image-wrapper {
        filter:hue-rotate(3.142rad);
    }

    .image-item {
        width:100%;
        height:100%;
        object-fit:cover;
        transition:opacity 0.5s ease-in-out 0s;
        opacity:0;
    }
	</style>`;

customElements.define('kb-spotcomponent', SpotComponent);
