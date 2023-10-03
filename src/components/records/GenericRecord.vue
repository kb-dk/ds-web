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
import { GenericRecordType } from '@/types/GenericRecordTypes';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
	name: 'GenericRecord',
	components: {},
	props: {
		recordData: {
			type: Object as PropType<GenericRecordType>,
			required: true,
		},
	},
});
</script>
