
import { SystemEvent } from '../cqrs/event/system.event.js';
import { Entity } from './enity.js'



export abstract class DomainEvent<T extends Entity = Entity>
  extends SystemEvent<T> {

}
