import { MessageHandler } from '~foundry/messaging/message-handler.js'
import { Message }        from '~foundry/messaging/message.js'



export abstract class MessageBus {
	abstract send<T = unknown>(message: Message<T>): Promise<void>

	abstract subscribe<T>(messageType: string, handler: MessageHandler<T>): Promise<void>

	abstract unsubscribe<T>(messageType: string, handler: MessageHandler<T>): Promise<void>
}
