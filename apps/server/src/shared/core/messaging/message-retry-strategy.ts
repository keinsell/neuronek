export interface MessageRetryStrategy {
	shouldRetry(err: Error): boolean

	getRetryDelay(err: Error, retryCount: number): number
}
