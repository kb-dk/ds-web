import { ImageComponentType } from '@/types/ImageComponentType';

class ImageComponent extends HTMLElement {
	shadow: ShadowRoot;
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.innerHTML = IMAGE_COMPONMENT_TEMPLATE + IMAGE_COMPONMENT_STYLES;
		const imageWrapper: HTMLDivElement | null = this.shadow.querySelector('.image-wrapper');
		if (imageWrapper) {
			imageWrapper.style.background = `linear-gradient(${Math.round(Math.random() * 360)}deg, #caf0fe, #002e70)`;
		}
		const image: HTMLImageElement | null = this.shadow.querySelector('.image-item');
		if (image && imageWrapper) {
			image.addEventListener('load', this.showImage);
		}
	}

	static get observedAttributes() {
		return ['imagedata'];
	}

	showImage() {
		this.style.opacity = '1';
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (name === 'imagedata') {
			const imageData = JSON.parse(newValue) as ImageComponentType;
			const thumb = this.shadow.querySelector('.image-item') as HTMLImageElement;
			if (imageData.imgSrc !== undefined) {
				thumb && (thumb.src = imageData.imgSrc);
			}
			if (imageData.placeholder !== undefined) {
				thumb && (thumb.src = imageData.placeholder);
				thumb.style.backgroundColor = 'rgb(237,237,237)';
			}
			if (imageData.objectPos !== undefined) {
				thumb.style.objectPosition = imageData.objectPos;
			}
			if (imageData.imgOption !== undefined) {
				thumb.style.objectFit = imageData.imgOption;
			}
			if (imageData.altText && this.shadow.querySelector('.image-item')) {
				this.shadow.querySelector('.image-item')?.setAttribute('alt', imageData.altText);
			}
			if (imageData.imgTitle && this.shadow.querySelector('.image-item')) {
				this.shadow.querySelector('.image-item')?.setAttribute('title', imageData.imgTitle);
			}
			if (imageData.icon) {
				const iconHolder = this.shadow.querySelector('.type-symbol');
				iconHolder && (iconHolder.textContent = imageData.icon);
			}
			if (imageData.iconColor) {
				const icon = this.shadow.querySelector('.type-symbol') as HTMLElement;
				icon && (icon.style.color = imageData.iconColor);
			}
			if (imageData.aspect) {
				const imageWrapper = this.shadow.querySelector('.image-wrapper') as HTMLElement;
				imageWrapper && (imageWrapper.style.aspectRatio = imageData.aspect);
			}
		}
	}
}

const IMAGE_COMPONMENT_TEMPLATE = /*html*/ `
        <figure class="image-wrapper">
            <img
								draggable="false"
                loading="lazy"
                class="image-item"
            /><span class="type-symbol material-icons"></span>
        </figure>
`;

const IMAGE_COMPONMENT_STYLES = /*css*/ `
	<style>
		:host {
			--image-item-scale: 1.0;
			--image-item-hue-rotation: 0rad;
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

	.type-symbol {
        font-size:64px !important;
        position: absolute !important;
        left: 50% !important;
        top: 50% !important;
        transform: translate(-50%, -50%);
    }

    .image-wrapper {
				position: relative;
				overflow: hidden;
        background: linear-gradient(45deg, #caf0fe, #002e70);
        width:100%;
				height:100%;
        padding:0px;
        margin-block-start: 0em;
        margin-block-end: 0em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        transition:opacity 0.3s ease-in-out 0s, filter 0.3s ease-in-out 0s, transform 0.3s ease-in-out 0s;
        filter:hue-rotate(var(--image-item-hue-rotation));
				animation: rotateGradient 2s linear infinite; /* Apply the animation */

    }

		.image-item {
			width: calc(100% + 1px);
   		height: calc(100% + 1px);
			object-fit: cover;
			transition:opacity 0.3s ease-in-out 0s, filter 0.3s ease-in-out 0s, transform 0.3s ease-in-out 0s, all 0.3s ease-in-out 0s;
			opacity:0;
			transform:scale3d(var(--image-item-scale), var(--image-item-scale) ,var(--image-item-scale));
			transform-origin:center;
			will-change: transform;
			-webkit-user-select: none;
			-khtml-user-select: none;
			-moz-user-select: none;
			-o-user-select: none;
			-ms-user-select: none;
			user-select: none;
	}

		@keyframes rotateGradient {
			from {
				background-position: 0% 0%;
			}
			to {
				background-position: 100% 100%;
			}
		}
	</style>`;

customElements.define('kb-imagecomponent', ImageComponent);
