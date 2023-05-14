import { Query } from './query'

export abstract class QueryBus {
	abstract handle<RESPONSE>(event: Query): Promise<RESPONSE>
}
