import { Handler }     from '../../base/handler.js'
import { SystemEvent } from './system.event.js'



export abstract class EventHandler<T extends SystemEvent>
	implements Handler<T, void> {
	abstract handle(message : T) : Promise<void> | void
}
