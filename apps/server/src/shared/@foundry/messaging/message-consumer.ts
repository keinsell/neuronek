import { ClassConstructor } from '../technical/class-constructor.js'
import { MessageHandler }   from './message-handler'
import { Message }          from './message.js'



export abstract class MessageConsumer<MESSAGE extends Message<unknown>> {
	abstract start() : Promise<void>
	
	abstract stop() : Promise<void>
	
	abstract subscribe<T extends MESSAGE>(message : ClassConstructor<T>, handler : MessageHandler<T>) : Promise<void>
	
	abstract unsubscribe<T extends MESSAGE>(message : ClassConstructor<T>, handler : MessageHandler<T>) : Promise<void>
}
