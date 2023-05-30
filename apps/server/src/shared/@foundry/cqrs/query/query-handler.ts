import { Query } from './query'

export abstract class QueryHandler<T> {
	abstract handle(query: Query): Promise<T>
}
