<template>
	<div class="container">
		<!-- FOR TESTING PURPOSES ONLY-->
		<button @click="spawnNotePassive()">passive</button>
		<button @click="spawnNoteUser()">user</button>

		<div class="user-notifications">
			<TransitionGroup
				tag="ul"
				name="user"
			>
				<NotificationItem
					:key="item.count"
					v-for="item in notificationStore.notifications.filter((notification) => notification.userClose === true)"
					:notification="item"
					:close="removeNotification"
				></NotificationItem>
			</TransitionGroup>
		</div>
		<div class="passive-notifications">
			<TransitionGroup
				tag="ul"
				name="passive"
			>
				<NotificationItem
					:key="item.count"
					v-for="item in notificationStore.notifications.filter((notification) => notification.userClose === false)"
					:notification="item"
					:close="removeNotification"
				></NotificationItem>
			</TransitionGroup>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useNotificationStore } from '@/store/notificationStore';
import NotificationItem from '@/components/notification/NotificationItem.vue';
import { NotificationType } from '@/types/Notifications';

export default defineComponent({
	name: 'NotificationManager',
	components: {
		NotificationItem,
	},
	data: () => ({}),

	setup() {
		const notificationStore = useNotificationStore();
		return { notificationStore };
	},

	created() {
		console.log('created');
	},
	methods: {
		spawnNotePassive() {
			this.notificationStore.addNotification(
				(Math.random() * 2525252525).toString(),
				'test test desc test desc test desc test desc test desc',
				'moderate',
				false,
			);
		},
		spawnNoteUser() {
			this.notificationStore.addNotification(
				(Math.random() * 2525252525).toString(),
				'test test desc test desc test desc test desc test desc',
				'moderate',
				true,
			);
		},
		removeNotification(notification: NotificationType) {
			this.notificationStore.removeNotification(notification);
		},
	},
});
</script>

<style lang="scss" scoped>
.passive-move, /* apply transition to moving elements */
.passive-enter-active,
.passive-leave-active {
	transition: all 0.5s ease;
}

.passive-enter-from,
.passive-leave-to {
	opacity: 0;
	//transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.passive-leave-active {
	position: absolute;
}

.user-move, /* apply transition to moving elements */
.user-enter-active,
.user-leave-active {
	transition: all 0.5s ease;
}

.user-enter-from,
.user-leave-to {
	opacity: 0;
	//transform: translateY(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.user-leave-active {
	position: absolute;
}

ul {
	padding: 0px;
}
.user-notifications {
	position: fixed;
	z-index: 50;
	width: 100%;
	max-width: 300px;
	left: 50%;
	transform: translateX(-50%);
}

.passive-notifications {
	position: fixed;
	z-index: 50;
	width: 100%;
	max-width: 300px;
	right: 10px;
}

.passive-notifications ul {
	list-style-type: none;
	pointer-events: none;
	right: unset;
}

.user-notifications ul {
	list-style-type: none;
	pointer-events: none;
}
</style>
