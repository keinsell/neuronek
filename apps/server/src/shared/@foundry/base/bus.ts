import { Message } from '../messaging/message.js'
import { Handler } from './handler.js'



export abstract class Bus<M = Message<unknown>> {
	abstract publish<T extends M>(message : T) : Promise<void> | void;
	
	abstract subscribe<T extends M>(message : T, handler : Handler<T>) : Promise<void> | void;
	
	abstract unsubscribe<T extends M>(message : T, handler : Handler<T>) : Promise<void> | void;
}

