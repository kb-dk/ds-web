<template>
	<div class="extra-features">
		<button
			:disabled="fileId?.length > 0 && type === 'tv' ? false : true"
			:class="extraContentShown ? 'thumbnail-button active' : 'thumbnail-button'"
			:title="$t('search.thumbnailButton')"
			:data-testid="addTestDataEnrichment('button', 'additional-info', `show-thumbnails`, nr)"
			@click="showThumbnails()"
		>
			<span class="material-icons thumbnails-icon">photo_library</span>
			{{ $t('search.thumbnail') }}
			<span :class="extraContentShown ? 'material-icons expand-icon turned' : 'material-icons expand-icon'">
				expand_more
			</span>
		</button>
	</div>
	<div
		ref="extraContentRef"
		class="extra-content"
	>
		<ItemSlider
			:padding="true"
			bg="#002e70"
			item-class="extra-thumbnail"
		>
			<template #default="slotProps">
				<router-link
					v-for="(item, index) in thumbnailImages"
					:key="index"
					draggable="false"
					:to="{ name: 'Record', params: { id: id }, query: { autoplay: true, startAt: timeStamps[index] / 1000 } }"
					role="link"
					class="extra-thumbnail"
					:title="$t('search.thumbnailLink', { index: index + 1, timestamp: convertSecondstoShow(timeStamps[index]) })"
					v-bind="slotProps"
					:replace="router.currentRoute.value.name === 'Record' ? true : false"
					:data-testid="addTestDataEnrichment('link', 'additional-info', `individual-thumbnail-${id}`, index)"
				>
					<div
						ref="thumbnailRefs"
						class="img-wrap"
					>
						<kb-imagecomponent :imagedata="thumbnailImageData[index]"></kb-imagecomponent>
					</div>
					<div class="img-stamp">
						{{ convertSecondstoShow(timeStamps[index]) }}
						<span class="material-icons link-arrow">chevron_right</span>
					</div>
				</router-link>
			</template>
		</ItemSlider>
		<div class="full-duration">{{ convertSecondstoShow(duration) }}</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, ref, watch } from 'vue';
import ItemSlider from '@/components/search/ItemSlider.vue';
import { APIService } from '@/api/api-service';
import gsap from 'gsap';
import { ImageComponentType } from '@/types/ImageComponentType';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { convertSecondstoShow } from '@/utils/time-utils';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import { Priority, Severity } from '@/types/NotificationType';
import { ErrorManagerType } from '@/types/ErrorManagerType';

export default defineComponent({
	name: 'AdditionalInfo',
	components: {
		ItemSlider,
	},
	props: {
		id: { type: String, required: true },
		type: { type: String, required: true },
		fileId: { type: String, required: true },
		duration: { type: Number, required: true },
		open: { type: Boolean },
		nr: { type: Number, required: true },
	},
	setup(props) {
		const { t } = useI18n();
		const errorManager = inject('errorManager') as ErrorManagerType;
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
					display: 'block',
				});
			}
			gsap.to(extraContentRef.value, {
				height: extraContentShown.value ? 'auto' : '0px',
				opacity: extraContentShown.value ? '1' : '0',
				marginBottom: extraContentShown.value ? '20px' : '0px',
				duration: 0.2,
				onComplete: () => {
					if (extraContentShown.value === false) {
						gsap.set(extraContentRef.value, {
							display: 'none',
						});
					}
				},
			});
		};

		const requestExtraThumbnails = () => {
			APIService.getExtraThumbnails(props.fileId)
				.then((thumbServiceResponse) => {
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
						timeStamps.value.push((props.duration / 10) * index + 3000 + index * 3000);
					});
				})
				//Just in case the service fail - we fail silently and swoop in with the placeholder
				.catch(() => {
					errorManager.submitCustomError(
						'thumbnails-error',
						t('error.infoError.title'),
						t('error.infoError.thumbnails'),
						Severity.INFO,
						false,
						Priority.LOW,
					);
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
			errorManager,
			addTestDataEnrichment,
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

.expand-icon {
	transition: all 0.3s ease-in-out 0s;
	padding-right: 5px;
}

.expand-icon.turned {
	transform: rotateZ(180deg);
}

.link-arrow {
	font-size: 20px;
	top: -3px;
	position: absolute;
	opacity: 0;
	transition: all 0.1s linear 0s;
}

.extra-thumbnail:hover .link-arrow {
	opacity: 1;
	transform: translateX(5px);
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
	transition:
		all 0.3s ease-in-out 0s,
		margin-bottom 0s linear 0s;
	top: 1px;
	position: relative;
	padding: 5px 15px;
	width: 100%;
	margin-bottom: 15px;
}

.thumbnails-icon {
	padding-right: 5px;
}

.thumbnail-button.active {
	background-color: #001e4b;
	color: white;
	border: 1px solid #001e4b;
	margin-bottom: 0px;
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
	margin-bottom: 0px;
	overflow: hidden;
	display: none;
	padding-bottom: 10px;
	background-color: rgb(0, 46, 112);
	position: relative;
}

.extra-content:after {
	z-index: 1;
	display: block;
	content: '';
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	pointer-events: none;
	box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 20px 5px inset;
}

.full-duration {
	position: absolute;
	display: inline-block;
	right: 0px;
	z-index: 1;
	margin-top: -18px;
	padding: 0px 2px;
	padding-right: 10px;
	padding-left: 6px;
	color: white;
	background-color: #002e70;
	border-left: 1px solid white;
	line-height: 18px;
	opacity: 0.9;
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
	height: 15px;
	position: relative;
}
@media (min-width: 800px) {
	.thumbnail-button {
		width: auto;
		margin-bottom: 0px;
	}
	.thumbnail-button.active {
		margin-bottom: 0px;
	}
	.extra-content {
		width: calc(100% - 20px);
	}
}

@media (min-width: 1340px) {
	.extra-content {
		width: 100%;
	}
}
</style>
