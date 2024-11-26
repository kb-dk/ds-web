export interface NotificationType {
	title: string;
	desc: string;
	key: boolean;
	severity: Severity;
	userClose: boolean;
	time: number;
	count: number;
	priority: Priority;
}

export enum Severity {
	ERROR,
	INFO,
	SUCCESS,
}

export enum Priority {
	LOW,
	MEDIUM,
	HIGH,
}
