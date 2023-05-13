import { SimpleEvent } from '../cqrs/event/simple-event'

export abstract class DomainEvent<T> extends SimpleEvent<T> {}
