import { defineStore } from 'pinia';
import { NotificationType, Priority, Severity } from '@/types/NotificationType';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notificationStore', () => {
	const notifications = ref([] as Array<NotificationType>);
	const count = ref(0);

	const addNotification = (
		title: string,
		desc: string,
		key: boolean,
		severity: Severity,
		userClose: boolean,
		priority: Priority,
	) => {
		const notification: NotificationType = {
			title: title,
			desc: desc,
			key: key,
			severity: severity,
			userClose: userClose,
			time: new Date().getTime(),
			count: count.value,
			priority: priority,
		};
		const foundItems = notifications.value.find((value) => {
			return value.priority === Priority.HIGH;
		});
		if (!foundItems) {
			if (notification.priority === Priority.HIGH) {
				resetNotifications();
			}
			addToCount();
			notifications.value.push(notification);
		}
	};

	const addToCount = () => {
		count.value++;
	};

	const resetNotifications = () => {
		notifications.value = [];
	};

	const removeNotification = (notification: NotificationType) => {
		notifications.value.splice(notifications.value.indexOf(notification), 1);
	};

	return {
		notifications,
		addNotification,
		resetNotifications,
		removeNotification,
	};
});
