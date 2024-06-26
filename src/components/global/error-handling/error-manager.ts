import { AxiosError } from 'axios';
import { createApp } from 'vue';
import { ErrorManagerType } from '@/types/ErrorManagerType';

export class ErrorManager implements ErrorManagerType {
	private errorHistory: (AxiosError | string)[] = [];

	// Singleton pattern - we only want one instance
	private static instance: ErrorManager | null = null;

	public static getInstance(): ErrorManager {
		if (!ErrorManager.instance) {
			ErrorManager.instance = new ErrorManager();
		}
		return ErrorManager.instance;
	}

	/* Wanted to differantiate between axios errors and custom errors and
	the most concise way was to make two public methods instead of one big 
	one that diferentiates. */
	public submitError(error: AxiosError, message: string): void {
		this.handleError(error, message);
	}

	public submitCustomError(error: string, message: string): void {
		this.handleError(error, message);
	}

	private handleError(error: AxiosError | string, message: string) {
		// Check if the current error is in the error history
		if (!this.isErrorInHistory(error)) {
			this.publishNotifyEvent(message);
			this.errorHistory.push(error);

			// Remove error after 5 seconds
			this.removeErrorFromHistory(error, 5000);
		} else {
			// If the error is in history do nothing for now - we already notified the user about it
		}
	}

	private isErrorInHistory(error: AxiosError | string): boolean {
		return this.errorHistory.some((historyError) => {
			if (typeof historyError === 'string' && typeof error === 'string') {
				return historyError === error;
			} else if (typeof historyError !== 'string' && typeof error !== 'string') {
				return this.isSameError(historyError as AxiosError, error as AxiosError);
			}
			return false;
		});
	}

	private isSameError(error1: AxiosError, error2: AxiosError): boolean {
		if (!error1 || !error2) {
			return false;
		}
		const isSameCode = error1.code === error2.code;

		const isSameStatus = error1.response?.status === error2.response?.status;

		// Simple compare 'method' - for more advanced use we should have a dedicated comparator
		return isSameCode && isSameStatus;
	}

	private removeErrorFromHistory(error: AxiosError | string, delayMs: number) {
		setTimeout(() => {
			const index = this.errorHistory.indexOf(error);
			if (index !== -1) {
				this.errorHistory.splice(index, 1);
			}
		}, delayMs);
	}

	private getNotifierMessage(message: string) {
		return { title: 'error', message: message };
	}

	private publishNotifyEvent(message: string) {
		const notifierMsgDetails = this.getNotifierMessage(message);
		const customEvent = new CustomEvent('notify-user', {
			detail: notifierMsgDetails,
		});
		window.dispatchEvent(customEvent);
	}
}

// Export hook to provide ErrorManager globally
export function provideErrorManager(app: ReturnType<typeof createApp>): void {
	app.provide('errorManager', ErrorManager.getInstance());
}
