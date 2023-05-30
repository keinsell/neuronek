import { Query } from './query'
import { QueryHandler } from '~foundry/cqrs/index.js'

export abstract class QueryBus {
	abstract handle<QR>(query: Query): Promise<QR> | QR

	abstract register<T extends Query>(query: { new (...args: any[]): T }, handler: QueryHandler<T>): Promise<void> | void
}
