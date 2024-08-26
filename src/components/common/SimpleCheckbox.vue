<template>
	<div class="container">
		<Transition
			mode="out-in"
			name="result"
		>
			<div
				v-if="!loading"
				class="checkbox-container"
			>
				<label
					:title="title"
					class="label"
				>
					<span class="title">{{ title }}</span>
					<span class="tag-number">{{ displayAmount(amount) }}</span>
					<input
						role="checkbox"
						tabindex="0"
						type="checkbox"
						class="checkbox"
						:checked="checked"
						@change="check(fqkey, title)"
					/>
				</label>
			</div>
			<div
				v-else
				class="loading"
			>
				<div
					:style="`animation-delay:${Math.random() * 2}s`"
					class="shimmer"
				></div>
				<div class="name">
					<span
						:style="`width:${Math.random() * 15 + 20}px`"
						class="text"
					></span>
					<span
						:style="`width:${Math.random() * 15 + 20}px`"
						class="text"
					></span>
					<span
						:style="`width:${Math.random() * 15 + 20}px`"
						class="text"
					></span>
				</div>
				<label>
					loading
					<input
						disabled
						role="checkbox"
						tabindex="0"
						:checked="checked"
						type="checkbox"
						class="checkbox"
					/>
				</label>
			</div>
		</Transition>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
	addChannelFilter,
	removeChannelFilter,
	channelFilterExists,
	createAffiliationFilter,
} from '@/utils/filter-utils';
import { useSearchResultStore } from '@/store/searchResultStore';
export default defineComponent({
	name: 'SimpleCheckbox',
	props: {
		fqkey: {
			type: String,
			required: false,
			default() {
				return '';
			},
		},
		title: {
			type: String,
			required: false,
			default() {
				return '';
			},
		},
		amount: {
			type: String,
			required: false,
			default() {
				return '';
			},
		},
		timeSearchActive: {
			type: Boolean,
			required: false,
			default() {
				return false;
			},
		},
		checked: { type: Boolean, required: false },
		loading: { type: Boolean, required: true },
	},
	setup(props) {
		const router = useRouter();
		const route = useRoute();
		const searchResultStore = useSearchResultStore();
		const check = (key: string | undefined, title: string | undefined) => {
			if (title && key) {
				const routeQueries = channelFilterExists(key, title, searchResultStore.channelFilters)
					? removeChannelFilter(route, createAffiliationFilter(title), props.timeSearchActive)
					: addChannelFilter(route, createAffiliationFilter(title), props.timeSearchActive);
				routeQueries.start = 0;
				router.push({ query: routeQueries });
			}
		};

		const displayAmount = (value: string | undefined) => {
			return value ? `(${value})` : '';
		};

		return { check, displayAmount };
	},
});
</script>

<style scoped>
:host {
	display: block;
	transition: all 0.3s linear;
	height: 25px;
	width: 100%;
	margin-right: 5px;
}

.loading {
	flex-direction: row;
	height: 25px;
	justify-content: space-between;
	display: flex;
}

.shimmer {
	animation: loading 3s ease-in-out 0s infinite;
	background: rgb(255, 255, 255);
	background: linear-gradient(
		117deg,
		rgba(255, 255, 255, 0) 44%,
		rgba(255, 255, 255, 0.7455357142857143) 64%,
		rgba(255, 255, 255, 0) 77%
	);
	position: absolute;
	width: 100%;
	height: 25px;
	mix-blend-mode: overlay;
	overflow: hidden;
	background-size: 200% 100%;
	background-position: 160% center;
	opacity: 0.5;
}

.name {
	height: 100%;
	display: flex;
	gap: 5px;
}

.loading label {
	color: transparent;
	user-select: none;
}

.loading .name .text {
	margin: 5px 0px;
	border-radius: 20px;
	background-color: rgba(170, 170, 170, 1);
	height: 12px;
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

.checkbox-container {
	padding: 0px 5px;
	text-align: left;
}

.tag-number {
	font-size: 10px;
	color: #383838;
	display: inline-block;
	padding-left: 5px;
	vertical-align: bottom;
	line-height: 24px;
	height: 100%;
}

.title {
	font-size: 14px;
	text-overflow: ellipsis;
	max-width: calc(100% - 85px);
	white-space: nowrap;
	overflow: hidden;
	display: inline-block;
	text-transform: uppercase;
	color: #002e70;
}

.loading .checkbox:after {
	border: 1px solid rgba(170, 170, 170, 1) !important;
	background-color: rgb(255, 255, 255) !important;
	cursor: default;
}

.loading .checkbox:checked:after {
	background-color: rgba(170, 170, 170, 1) !important;
}

.loading .checkbox:hover:before {
	cursor: default !important;
	border-color: white !important;
}

.checkbox:disabled {
	cursor: default;
}

.checkbox:disabled:hover {
	cursor: default;
}

.checkbox:disabled:hover:after {
	background-color: transparent;
	cursor: default;
}

.checkbox:disabled:hover:after {
	cursor: default;
	background-color: #002e70;
}

.checkbox:hover:after {
	background-color: #caf0fe;
}

.checkbox:checked:hover:before {
	border-color: #002e70;
	cursor: pointer;
}
.checkbox:checked:hover:after {
	border-color: rgba(170, 170, 170, 1);
	background-color: white;
}

input:focus {
	box-shadow: 0 0 0 2px rgba(39, 94, 254, 0.5);
}

.checkbox {
	-webkit-appearance: none;
	-moz-appearance: none;
	outline: none;
	position: relative;
	float: right;
}

.checkbox:after {
	cursor: pointer;
	transition: all 0.15s linear 0s;
	content: '';
	display: block;
	width: 15px;
	height: 15px;
	border: 1px solid #002e70;
}

.checkbox:checked:after {
	background-color: #002e70;
}

.checkbox:checked:before {
	content: '';
	display: block;
	width: 7px;
	height: 12px;
	border-bottom: 2px solid white;
	border-right: 2px solid white;
	position: absolute;
	top: 1px;
	left: 5px;
	box-sizing: border-box;
	transform-origin: center;
	transform: rotateZ(45deg);
}

.label {
	cursor: pointer;
	display: block;
}
</style>
