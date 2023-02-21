export interface SearchResponse<T> {
	hits: T[]
	estimatedTotal: number
}
