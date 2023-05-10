export interface MessageCorrelation {
	registerCorrelation(messageId: string, correlationId: string): void

	getCorrelationId(messageId: string): string | undefined
}
