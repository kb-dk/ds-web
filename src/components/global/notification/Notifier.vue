<template>
	<div class="container">
		<div class="user-notifications">
			<TransitionGroup
				tag="ul"
				name="user"
			>
				<NotificationItem
					v-for="item in notificationStore.notifications.filter(
						(notification: NotificationType) => notification.userClose,
					)"
					:key="item.count"
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
					v-for="item in notificationStore.notifications.filter(
						(notification: NotificationType) => !notification.userClose,
					)"
					:key="item.count"
					:notification="item"
					:close="removeNotification"
				></NotificationItem>
			</TransitionGroup>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue';
import { useNotificationStore } from '@/store/notificationStore';
import NotificationItem from '@/components/global/notification/NotificationItem.vue';
import { NotificationType } from '@/types/NotificationType';

export default defineComponent({
	name: 'Notifier',
	components: {
		NotificationItem,
	},
	setup() {
		const notificationStore = useNotificationStore();

		onMounted(() => {
			window.addEventListener('notify-user', newNotification);

			/* just for testing */
			// notificationStore.addNotification('test notitication', 'this is a test', false, Severity.ERROR, false);
		});

		onUnmounted(() => {
			window.removeEventListener('notify-user', newNotification);
		});

		const newNotification = (e: Event) => {
			addNotification(e as CustomEvent);
		};

		const addNotification = (e: CustomEvent) => {
			notificationStore.addNotification(
				e.detail.title,
				e.detail.message,
				e.detail.key !== undefined ? e.detail.key : false,
				e.detail.severity,
				e.detail.userClose !== undefined ? e.detail.userClose : false,
				e.detail.priority,
			);
		};

		const removeNotification = (notification: NotificationType) => {
			notificationStore.removeNotification(notification);
		};

		return { notificationStore, newNotification, addNotification, removeNotification };
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
	max-width: 500px;
	left: 50%;
	transform: translateX(-50%);
}

.passive-notifications {
	position: fixed;
	z-index: 50;
	width: 100%;
	max-width: 300px;
	right: 35px;
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
