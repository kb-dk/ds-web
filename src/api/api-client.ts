import { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';
import {
	APISearchResponseType,
	APIRecordResponseType,
	APIMoreLikeThisResponseType,
	APIAutocompleteResponseType,
	APIThumbnailsResponseType,
	APIAuthResponseType,
	APIAuthMessagesType,
	// Extend AxiosRequestConfig to include _retryCount to keep TypeScript happy
	CustomAxiosRequestConfig,
} from '@/types/APIResponseTypes';

// Generic sleep function used for both 'authenticate retries' and 'articial latency in dev environment'
export function sleep(duration: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, duration));
}

export class APIServiceClient {
	private pendingRequests: (() => Promise<unknown>)[] = [];
	private maxRetries = 2;
	private retryDelay = 2000;
	private pendingRequestRetryCount = 0;

	constructor(private httpClient: AxiosInstance) {
		httpClient.interceptors.request.use(
			(config) => {
				// Hook to manipulate the request or the request header
				return config;
			},
			(error) => {
				return Promise.reject(error);
			},
		);

		httpClient.interceptors.response.use(
			async (response: AxiosResponse) => {
				// add artificial delay for dev env
				if (import.meta.env.MODE === 'development') {
					const noDelayRequest =
						response.config.url?.includes('suggest.dictionary=radiotv_title_suggest') ||
						response.config.url?.includes('record') ||
						response.config.url?.includes('mlt') ||
						response.config.url?.includes('thumbnails');
					if (!noDelayRequest) {
						await sleep(250);
					}
				}
				return response;
			},
			// This turned out to be a somewhat complex error handler but hopefully the comments will help
			async (error: AxiosError) => {
				const config = error.config as CustomAxiosRequestConfig;
				// If server throws 401 we know something is up with the users authorization and we try to help
				if (error.response?.status === 401) {
					const authStore = useAuthStore();

					// I threw this check in just in case but it shouldn't happen
					if (!config) {
						return Promise.reject(error);
					}

					// Track retry count for this request
					if (!config._retryCount) {
						config._retryCount = 0;
					}

					// Stop retrying if we've hit the maximum retry limit
					if (config._retryCount >= this.maxRetries) {
						return Promise.reject(error);
					}

					config._retryCount += 1;

					// We store the original request so we can use it later
					const originalRequest = () => this.httpClient.request(config as AxiosRequestConfig);

					if (authStore.isAuthenticating) {
						// If authentication is already in progress, queue the request
						return new Promise((resolve, reject) => {
							this.pendingRequests.push(() => originalRequest().then(resolve).catch(reject));
						});
					}

					try {
						// Try to authenticate just in case it's a stale session or bad cookie
						await this.handleAuthenticationWithRetry(authStore);

						/** A bit complex here but what is happening is in short:
						 *  Retry all pending requests after successful authentication (thats all
						 * 	the map((req) => req() business) and subsequently clear the queue.
						 *  After that we give the original request a go.
						 *  If we somehow get into a scenario where the retries fail we stop retrying
						 *  after 3 times.
						 * 	If the auth call fails, we clear the pending requests queue and reject
						 *  with an error.
						 */

						// Retry the pending requests but stop after a certain number of retries to prevent infinite retry loop
						if (this.pendingRequestRetryCount < this.maxRetries) {
							this.pendingRequestRetryCount += 1;

							await Promise.all(this.pendingRequests.map((req) => req()));
							this.pendingRequests = [];

							// Retry the original request that triggered the 401
							return originalRequest();

							// If all allowed retry attempts fail we clear the queue and stop further attempts
						} else {
							this.pendingRequests = [];
							return Promise.reject(error);
						}
					} catch (authError) {
						this.pendingRequests = [];
						return Promise.reject(authError);
					}
				}
				return Promise.reject(error);
			},
		);
	}

	//Private method to handle authentication and retries if the service fails
	private async handleAuthenticationWithRetry(authStore: ReturnType<typeof useAuthStore>) {
		for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
			try {
				await authStore.authenticate();
				return;
			} catch (error) {
				if (attempt < this.maxRetries) {
					await sleep(this.retryDelay);
				} else {
					throw error; // Throw error if all retries fail and we are dead in the water
				}
			}
		}
	}
	//Search and record methods
	async getFacetResults(query: string, filters: string, start: string, sort: string): Promise<APISearchResponseType> {
		return await this.httpClient.get(
			`bff/v1/proxy/search/?q=${encodeURIComponent(query)}&facet=true${filters}${start}${sort}&rows=0&facet.limit=-1`,
		);
	}

	async getFullResultWithFacets(): Promise<APISearchResponseType> {
		return await this.httpClient.get(`bff/v1/proxy/search/?q=*&facet=true&facet.limit=-1&rows=0`);
	}

	async getSearchResults(
		query: string,
		filters: string,
		rowCount: string,
		start: string,
		sort: string,
		uuid: string,
	): Promise<APISearchResponseType> {
		return await this.httpClient.get(
			`bff/v1/proxy/search/?q=${encodeURIComponent(
				query,
			)}&facet=false${filters}${start}${sort}&queryUUID=${uuid}&rows=${rowCount}`,
		);
	}

	async getTimeSearchResults(
		start: string,
		end: string,
		months: string,
		days: string,
		timeslots: string,
		uuid: string,
	): Promise<APISearchResponseType> {
		let timeConstraint = '';
		if (start && end) {
			timeConstraint = `&fq=startTime:${encodeURIComponent(`[${start} TO ${end}]`)}`;
		}
		return await this.httpClient.get(
			`bff/v1/proxy/search/?q=${encodeURIComponent(
				'*:*',
			)}&facet=false&queryUUID=${uuid}${timeConstraint}&rows=8${months}${days}${timeslots}&sort=startTime asc`,
		);
	}

	async getTimeStartEndResults(start: string, end: string, id: string): Promise<APISearchResponseType> {
		let timeConstrain = '';
		if (start && end) {
			timeConstrain = `startTime:${encodeURIComponent(`[${start} TO ${end}]`)}`;
		}
		return await this.httpClient.get(
			`bff/v1/proxy/search/?q=${timeConstrain} AND NOT id:"${id}"&rows=3&sort=startTime asc`,
		);
	}

	async getRecord(id: string): Promise<APIRecordResponseType> {
		const encodeId = encodeURIComponent(id);
		return await this.httpClient.get(`bff/v1/proxy/record/${encodeId}?format=JSON-LD`);
	}

	async getAutocomplete(query: string): Promise<APIAutocompleteResponseType> {
		return await this.httpClient.get(
			encodeURI(
				`bff/v1/proxy/suggest/?suggest.dictionary=radiotv_title_suggest&suggest.q=${query}&suggest.count=5&wt=json`,
			),
		);
	}

	async getMoreLikeThisRecords(id: string): Promise<APIMoreLikeThisResponseType> {
		return await this.httpClient.get(encodeURI(`bff/v1/proxy/mlt/?q=id:"${id}"&mlt.interestingTerms=list&rows=3`));
	}

	async getThumbnail(id: string): Promise<APIThumbnailsResponseType> {
		return await this.httpClient.get(`bff/v1/proxy/thumbnail/?fileId=${id}&width=200&height=105`);
	}

	async authenticate(): Promise<APIAuthResponseType> {
		return await this.httpClient.get('bff/v1/authenticate/');
	}

	async getKalturaConfIds(): Promise<APIAuthMessagesType> {
		return await this.httpClient.get('bff/v1/messages/');
	}

	async getExtraThumbnails(id: string): Promise<APIThumbnailsResponseType> {
		return await this.httpClient.get(`bff/v1/proxy/thumbnail/?fileId=${id}&width=200&vid_slices=10`);
	}
}
