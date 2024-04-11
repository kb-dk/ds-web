<template>
	<div class="extra-features">
		<button
			:disabled="fileId?.length > 0 ? false : true"
			class="thumbnail-button"
			:title="'See more thumbnails'"
			@click="showThumbnails()"
		>
			<span class="material-icons">photo_library</span>
		</button>
	</div>
	<div
		ref="extraContentRef"
		class="extra-content"
	>
		<ItemSlider item-class="extra-thumbnail">
			<template #default="slotProps">
				<router-link
					v-for="(item, index) in thumbnailImages"
					:key="index"
					:to="{ name: 'Record', params: { id: id }, query: { autoplay: true, startAt: timeStamps[index] / 1000 } }"
					role="link"
					class="extra-thumbnail"
					v-bind="slotProps"
					:replace="router.currentRoute.value.name === 'Record' ? true : false"
				>
					<div
						ref="thumbnailRefs"
						class="img-wrap"
					>
						<kb-imagecomponent :imagedata="thumbnailImageData[index]"></kb-imagecomponent>
					</div>
					<div class="img-stamp">{{ ConvertSecondstoShow(timeStamps[index]) }}</div>
				</router-link>
			</template>
		</ItemSlider>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import ItemSlider from '@/components/search/ItemSlider.vue';
import { APIService } from '@/api/api-service';
import gsap from 'gsap';
import { ImageComponentType } from '@/types/ImageComponentType';
import { useRouter } from 'vue-router';

export default defineComponent({
	name: 'AdditionalInfo',
	components: {
		ItemSlider,
	},
	props: {
		id: { type: String, required: true },
		fileId: { type: String, required: true },
		duration: { type: Number, required: true },
		open: { type: Boolean },
	},
	setup(props) {
		const thumbnailImages = ref(10);
		const extraContentShown = ref(false);
		const thumbnailImageData = ref([] as string[]);
		const timeStamps = ref([] as number[]);

		const router = useRouter();

		const extraContentRef = ref<HTMLElement | null>(null);
		const thumbnailRefs = ref<HTMLAnchorElement[]>([]);

		const showThumbnails = () => {
			extraContentShown.value = !extraContentShown.value;
			if (props.fileId && extraContentShown.value) {
				if (thumbnailImageData.value.length === 0) {
					requestExtraThumbnails();
				}
			}
			if (extraContentShown.value === true) {
				gsap.set(extraContentRef.value, {
					visibility: 'visible',
				});
			}
			gsap.to(extraContentRef.value, {
				height: extraContentShown.value ? 'auto' : '0px',
				opacity: extraContentShown.value ? '1' : '0',
				duration: 0.2,
				onComplete: () => {
					if (extraContentShown.value === false) {
						gsap.set(extraContentRef.value, {
							visibility: 'hidden',
						});
					}
				},
			});
		};

		const ConvertSecondstoShow = (milliseconds: number) => {
			const seconds = Math.floor(milliseconds / 1000); // Convert milliseconds to seconds
			const hours = Math.floor(seconds / 3600);
			const minutes = Math.floor((seconds % 3600) / 60);
			const remainingSeconds = seconds % 60;

			const timeStringSecond = (remainingSeconds < 10 ? '0' : '') + Math.round(remainingSeconds);
			const timeStringMinutes = (minutes < 10 ? '0' : '') + minutes;
			const timeString = `${hours}:${timeStringMinutes}:${timeStringSecond}`;
			return timeString;
		};

		const requestExtraThumbnails = () => {
			APIService.getExtraThumbnails(props.fileId)
				.then((thumbServiceResponse) => {
					console.log(thumbServiceResponse);

					const img = new Image();
					img.src = thumbServiceResponse.data.sprite;
					img.onload = () => {
						thumbnailRefs.value.forEach((item) => {
							item.style.height = img.height + 'px';
						});
					};

					thumbnailRefs.value.forEach((item, index) => {
						const imgData = {} as ImageComponentType;
						imgData.imgSrc = thumbServiceResponse.data.sprite;
						imgData.objectPos = `-${200 * index}px 0px`;
						imgData.imgOption = 'none';
						thumbnailImageData.value.push(JSON.stringify(imgData));
						timeStamps.value.push((props.duration / 10) * index);
					});
				})
				//Just in case the service fail - we fail silently and swoop in with the placeholder
				.catch(() => {
					//nay
				});
		};

		onMounted(() => {
			watch(
				() => props.id,
				(newVal: string, oldVal: string) => {
					if (newVal !== oldVal) {
						thumbnailImageData.value = [];
						extraContentShown.value = false;
					}
				},
			);

			console.log(router.currentRoute.value.name, 'ROUTE BABY');

			if (props.open) {
				showThumbnails();
			}
		});

		return {
			thumbnailImages,
			extraContentShown,
			thumbnailImageData,
			showThumbnails,
			extraContentRef,
			thumbnailRefs,
			timeStamps,
			ConvertSecondstoShow,
			router,
		};
	},
});
</script>
<style scoped>
.extra-features {
	margin-top: 10px;
}

.extra-features .material-icons {
	font-size: 20px;
}

.thumbnail-button {
	cursor: pointer;
	border: 1px solid #002f702a;
	border-radius: 0px;
	background-color: transparent;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #002e70;
	transition: all 0.3s ease-in-out 0s;
}

.thumbnail-button:hover {
	border: 1px solid #002e70;
}

.thumbnail-button:disabled:hover {
	border: 1px solid #002f702a;
	cursor: auto;
}

.thumbnail-button:disabled {
	color: rgba(180, 180, 180, 1);
}

.extra-content {
	height: 0px;
}

.extra-thumbnail {
	flex: 0 0 200px;
	position: relative;
	z-index: 1;
	object-fit: none;
	display: flex;
	flex-direction: column;
	pointer-events: all;
	text-decoration: none;
	color: #002e70;
}

.extra-thumbnail.disabled {
	pointer-events: none;
}

.extra-thumbnail .img-wrap {
	margin-bottom: 10px;
	height: 105px;
}

.extra-thumbnail .img-stamp {
	text-align: center;
	font-size: 12px;
}
</style>
