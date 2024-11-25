import { AxiosError } from 'axios';
import { Severity } from '@/types/NotificationType';

export interface ErrorManagerType {
	submitError(error: AxiosError, message: string): void;
	submitCustomError(error: string, title: string, message: string, severity: Severity, userClose: boolean): void;
}
