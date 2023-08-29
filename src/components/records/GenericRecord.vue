<template>
	<div class="">
		<div
			class=""
			v-for="(creator, index) in recordData.creator"
			:key="index"
		>
			{{ creator.name }},
			{{ creator.familyName }}
		</div>
	</div>
</template>

<script lang="ts">
import { GenericRecord } from '@/types/GenericRecord';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
	name: 'GenericRecord',
	components: {},
	props: {
		recordData: {
			type: Object as PropType<GenericRecord>,
			required: true,
		},
	},
});
</script>
