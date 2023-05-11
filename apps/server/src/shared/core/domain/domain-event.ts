import { Event } from '../cqrs/event/event'

export abstract class DomainEvent<T> extends Event<T> {}
