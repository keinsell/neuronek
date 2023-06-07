import { DomainEvent } from './domain-event.js'
import { Entity } from './enity.js'



export abstract class DomainHandler<T extends DomainEvent<Entity>> {
  abstract handle(event: T): Promise<void>
}
