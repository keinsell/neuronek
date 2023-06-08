import { ClassConstructor } from '../technical/class-constructor.js'
import { DomainEvent } from './domain-event.js'
import { DomainHandler } from './domain-handler.js'
import { Entity } from './enity.js'



export abstract class DomainBus<T extends DomainEvent<Entity>> {
  /**
   * Dispatch event to all subscribed handlers, this method uses "fire-and-forget" methods which makes the whole
   *  process asynchronous.
   */
  abstract dispatch(event: T): Promise<void> | void

  abstract handle(event: T): Promise<void> | void

  abstract subscribe<X extends T>(event: ClassConstructor<X>, handler: DomainHandler<X>): Promise<void> | void

  abstract unsubscribe<X extends T>(event: ClassConstructor<X>, handler: DomainHandler<X>): Promise<void> | void
}
