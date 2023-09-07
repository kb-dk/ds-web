import { AxiosError } from 'axios';

export interface ErrorManagerType {
	submitError(error: AxiosError): void;
}
