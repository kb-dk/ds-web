import { ImageComponentType } from '@/types/ImageComponentType';

const populateImageDataWithPlaceholder = (object: ImageComponentType) => {
	object.imgOption = 'contain';
	object.imgSrc = undefined;
	object.placeholder = new URL('@/assets/images/No-Image-Placeholder.svg.png', import.meta.url).href;
};

export { populateImageDataWithPlaceholder };
