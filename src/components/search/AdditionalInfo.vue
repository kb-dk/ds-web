<template>
	<div class="extra-features">
		<button
			:disabled="fileId?.length > 0 ? false : true"
			:class="extraContentShown ? 'thumbnail-button active' : 'thumbnail-button'"
			:title="$t('search.thumbnailButton')"
			@click="showThumbnails()"
		>
			<span class="material-icons">photo_library</span>
			Thumbnails
		</button>
	</div>
	<div
		ref="extraContentRef"
		class="extra-content"
	>
		<ItemSlider
			bg="#002e70"
			item-class="extra-thumbnail"
		>
			<template #default="slotProps">
				<router-link
					v-for="(item, index) in thumbnailImages"
					:key="index"
					:to="{ name: 'Record', params: { id: id }, query: { autoplay: true, startAt: timeStamps[index] / 1000 } }"
					role="link"
					class="extra-thumbnail"
					:title="$t('search.thumbnailLink', { index: index + 1, timestamp: convertSecondstoShow(timeStamps[index]) })"
					v-bind="slotProps"
					:replace="router.currentRoute.value.name === 'Record' ? true : false"
				>
					<div
						ref="thumbnailRefs"
						class="img-wrap"
					>
						<kb-imagecomponent :imagedata="thumbnailImageData[index]"></kb-imagecomponent>
					</div>
					<div class="img-stamp">{{ convertSecondstoShow(timeStamps[index]) }}</div>
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
import { useI18n } from 'vue-i18n';
import { convertSecondstoShow } from '@/utils/time-utils';

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
		const { t } = useI18n();

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

		const requestExtraThumbnails = () => {
			console.log('THIS HAPPENED');
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
						console.log(props.duration);
						timeStamps.value.push((props.duration / 10) * index + 3000 + index * 3000);
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
			convertSecondstoShow,
			router,
			t,
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
	border: 1px solid rgba(230, 230, 230, 1);
	border-radius: 0px;
	background-color: transparent;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #002e70;
	transition: all 0.3s ease-in-out 0s;
	top: 1px;
	position: relative;
	padding: 5px 15px;
}

.thumbnail-button.active {
	background-color: #002e70;
	color: white;
	border: 1px solid #002e70;
}

.thumbnail-button:hover {
	border: 1px solid #002e70;
}

.thumbnail-button:disabled:hover {
	border: 1px solid #002f702a;
	cursor: auto;
}

.thumbnail-button:disabled {
	color: rgb(150, 150, 150);
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
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-o-user-select: none;
	user-select: none;
	-webkit-user-drag: none;
	-moz-user-drag: none;
	-ms-user-drag: none;
	-o-user-drag: none;
	user-drag: none;
}

.extra-thumbnail.disabled {
	pointer-events: none;
}

.extra-thumbnail .img-wrap {
	margin-bottom: 10px;
	height: 105px;
	margin-top: 20px;
}

.extra-thumbnail .img-stamp {
	text-align: center;
	font-size: 12px;
	color: white;
}
</style>
