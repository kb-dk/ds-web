export interface NotificationType {
	title: string;
	desc: string;
	key: boolean;
	severity: Severity;
	userClose: boolean;
	time: number;
	count: number;
}

export enum Severity {
	ERROR,
	INFO,
	SUCCESS,
}
