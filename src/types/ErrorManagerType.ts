import { AxiosError } from 'axios';

export interface ErrorManagerType {
	submitError(error: AxiosError, message: string): void;
	submitCustomError(error: string, message: string): void;
}
