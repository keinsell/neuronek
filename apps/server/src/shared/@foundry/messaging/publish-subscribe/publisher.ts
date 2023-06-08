import { Message }                    from '../message.js'
import { Broker, EventEmitterBroker } from './broker'
import { Topic }                      from './topic.js'



export class Publisher<MessageType extends Message<unknown>> {
	constructor(public readonly broker : Broker<MessageType>) {
	}
	
	async publish<T extends MessageType>(message : T, topic? : Topic) : Promise<void> {
		return this.broker.publish( message, topic || message._topic )
	}
}


export class EventEmitterPublisher
	extends Publisher<Message<unknown>> {
	constructor(emitter : EventEmitterBroker) {
		super( emitter )
	}
}
