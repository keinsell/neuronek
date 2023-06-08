import { Query } from './query'



export abstract class QueryHandler<T extends Query<unknown>> {
	abstract handle(query: T): Promise<T['_cast']> | T['_cast']
}
