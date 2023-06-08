import { MessageHandler } from '../message-handler.js'
import { Message }        from '../message.js'
import { Topic }          from './topic.js'



export class Subscriber<MessageTypes extends Message<unknown>> {
	constructor(public readonly topic : Topic, private readonly handler : MessageHandler<MessageTypes>) {
	}
	
	async handle<T extends MessageTypes>(message : T) {
		return this.handler.handle( message )
	}
}
