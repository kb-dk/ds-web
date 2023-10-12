<template>
	<div class="container">
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
import NotificationItem from '@/components/global/notification/NotificationItem.vue';
import { NotificationType } from '@/types/NotificationType';

export default defineComponent({
	name: 'Notifier',
	components: {
		NotificationItem,
	},
	data: () => ({}),

	setup() {
		const notificationStore = useNotificationStore();
		return { notificationStore };
	},

	created: function () {
		window.addEventListener('notify-user', this.newNotification);
	},
	beforeUnmount() {
		window.removeEventListener('notify-user', this.newNotification);
	},
	methods: {
		newNotification(e: Event) {
			this.addNotification(e as CustomEvent);
		},
		addNotification(e: CustomEvent) {
			//this needs to be ironed out better o_O
			this.notificationStore.addNotification(e.detail.type, e.detail.message, 'low', Math.random() < 0.5);
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
