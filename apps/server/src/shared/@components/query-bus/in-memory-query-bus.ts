import { kebabSpace } from '../../utils/kebab-space.js'
import { Query, QueryBus, QueryHandler } from '~foundry/cqrs'
import { NotFound } from '~foundry/exceptions/not-found.js'

export class InMemoryQueryBus implements QueryBus {
	private readonly bindingStorage: Map<string, QueryHandler<any>>

	constructor() {
		this.bindingStorage = new Map<string, QueryHandler<any>>()
	}

	public async handle<QR>(query: Query): Promise<QR> {
		const eventType = kebabSpace(query.constructor.name)
		const handler = this.bindingStorage.get(eventType)

		console.log(this.bindingStorage)

		if (!handler) {
			throw new NotFound(`Query handler for ${eventType} not found`)
		}

		return await handler.handle(query)
	}

	public register<T extends Query>(
		queryConstructor: { new (...args: any[]): T },
		handler: QueryHandler<any>
	): Promise<void> | void {
		const eventType = kebabSpace(queryConstructor.name)

		if (this.bindingStorage.has(eventType)) {
			throw new Error(`Query handler for ${eventType} already registered`)
		}

		this.bindingStorage.set(eventType, handler)
	}
}
