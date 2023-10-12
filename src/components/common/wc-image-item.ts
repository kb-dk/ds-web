import { ImageComponentType } from '@/types/ImageComponentType';

class ImageComponent extends HTMLElement implements ImageComponentType {
	imgSrc: string | undefined;
	imgTitle: string | undefined;
	altText: string | undefined;
	icon: string | undefined;
	aspect: string | undefined;
	placeholder: string | undefined;
	constructor() {
		super();
		this.innerHTML = IMAGE_COMPONMENT_TEMPLATE + IMAGE_COMPONMENT_STYLES;
		const imageWrapper: HTMLDivElement | null = this.querySelector('.image-wrapper');
		const image: HTMLImageElement | null = this.querySelector('.image-item');
		if (image && imageWrapper) {
			image.addEventListener('load', this.showImage);
		}
	}

	showImage() {
		this.style.opacity = '1';
	}

	connectedCallback() {
		const thumb = this.querySelector('.image-item') as HTMLImageElement;
		if (this.imgSrc !== undefined) {
			thumb && (thumb.src = this.imgSrc);
		} else if (this.placeholder !== undefined) {
			thumb && (thumb.src = this.placeholder);
			thumb.style.backgroundColor = 'rgb(237,237,237)';
			thumb.style.objectFit = 'contain';
		}
		if (this.altText && this.querySelector('.image-item')) {
			this.querySelector('.image-item')?.setAttribute('alt', this.altText);
		}
		if (this.imgTitle && this.querySelector('.image-item')) {
			this.querySelector('.image-item')?.setAttribute('title', this.imgTitle);
		}
		if (this.icon) {
			const iconHolder = this.querySelector('.type-symbol');
			iconHolder && (iconHolder.textContent = this.icon);
		}
		if (this.aspect) {
			const imageWrapper = this.querySelector('.image-wrapper') as HTMLElement;
			imageWrapper && (imageWrapper.style.aspectRatio = this.aspect);
		}
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === 'locale') {
			this.lang = newValue;
		}
	}
}

const IMAGE_COMPONMENT_TEMPLATE = /*html*/ `
        <figure class="image-wrapper">
            <img
                loading="lazy"
                class="image-item"
            /><span class="type-symbol material-icons"></span>
        </figure>
`;

const IMAGE_COMPONMENT_STYLES = /*css*/ `
	<style>
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

	.type-symbol {
        font-size:64px !important;
        position: absolute !important;
        left: 50% !important;
        top: 50% !important;
        transform: translate(-50%, -50%);
    }

    .image-wrapper {
        background: linear-gradient(45deg, #caf0fe, #fff6c4);
        width:100%;
		height:100%;
        padding:0px;
        margin-block-start: 0em;
        margin-block-end: 0em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        transition:all 0.3s ease-in-out 0s;
        filter:hue-rotate(0rad);
    }

    .image-item {
        width:100%;
        height:100%;
        object-fit:cover;
        transition:opacity 0.5s ease-in-out 0s;
        opacity:0;
    }
	</style>`;

customElements.define('kb-imagecomponent', ImageComponent);
