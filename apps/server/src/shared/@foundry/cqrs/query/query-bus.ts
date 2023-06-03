import { QueryHandler }     from '~foundry/cqrs/index.js'
import { ClassConstructor } from '../../technical/class-constructor.js'
import { Query }            from './query'



export abstract class QueryBus {
	abstract handle<T extends Query<unknown>>(query : T) : Promise<T['_cast']> | T['_cast']
	
	abstract register<T extends Query<unknown>>(
		query : ClassConstructor<T>, handler : QueryHandler<T>) : Promise<void> | void
}
