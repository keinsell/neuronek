import { Query } from './query'

export abstract class QueryHandler<T> {
	abstract execute(query: Query): Promise<T>
}
