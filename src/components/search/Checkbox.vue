<template>
	<div class="container">
		<Transition
			mode="out-in"
			name="fade"
		>
			<div
				v-if="!loading"
				class="checkbox-container"
			>
				<label class="label">
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
import { addFilter, removeFilter, filterExists, createAffiliationFilter } from '@/utils/filter-utils';
export default defineComponent({
	name: 'Checkbox',
	props: {
		fqkey: { type: String, required: false },
		title: { type: String, required: false },
		amount: { type: String, required: false },
		checked: { type: Boolean, required: false },
		loading: { type: Boolean, required: true },
	},
	setup() {
		const router = useRouter();
		const route = useRoute();

		const check = (key: string | undefined, title: string | undefined) => {
			if (title && key) {
				const routeQueries = filterExists(key, title)
					? removeFilter(route, createAffiliationFilter(title))
					: addFilter(route, createAffiliationFilter(title));
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
	width: 100vw;
	max-width: 100%;
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
	width: 35px;
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
	justify-content: space-between;
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
	max-width: calc(100% - 38px);
	white-space: nowrap;
	overflow: hidden;
	display: inline-block;
	text-transform: uppercase;
	font-weight: bold;
}

.checkbox {
	position: relative;
	top: 2px;
	float: right;
	--active: #275efe;
	--active-inner: #fff;
	--focus: 2px rgba(39, 94, 254, 0.3);
	--border: rgba(30, 30, 30, 0);
	--border-hover: #002e70;
	--background: rgba(30, 30, 30, 0.4);
	--disabled: #f6f8ff;
	--disabled-inner: #e1e6f9;
	-webkit-appearance: none;
	-moz-appearance: none;
	height: 21px;
	outline: none;
	display: inline-block;
	vertical-align: top;
	position: relative;
	margin: 0;
	cursor: pointer;
	border: 1px solid var(--bc, var(--border));
	background: var(--b, var(--background));
	transition:
		background 0.3s,
		border-color 0.3s,
		box-shadow 0.2s;
	width: 38px;
	border-radius: 11px;
}

.checkbox:disabled {
	cursor: default;
}

.checkbox:disabled:hover {
	cursor: default;
}

.checkbox:disabled:hover:after {
	background-color: #e9ecef;
}

.checkbox:hover:after {
	background-color: #caf0fe;
}
input:focus {
	box-shadow: 0 0 0 2px rgba(39, 94, 254, 0.5);
}

.checkbox:checked {
	--background: #002e70;
}
.checkbox:after {
	content: '';
	display: block;
	position: absolute;
	width: 15px;
	height: 15px;
	top: 2px;
	left: 1px;
	background-color: #e9ecef;
	border-radius: 180px;
	transition: all 0.3s ease-in-out;
}
.checkbox:checked:after {
	transform: translateX(19px);
}

.label {
	cursor: pointer;
	width: calc(100% - 38px);
}
</style>
