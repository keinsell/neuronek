import { MessageHandler } from './message-handler'



export abstract class MessageConsumer {
	abstract start(): Promise<void>

	abstract stop(): Promise<void>

	abstract subscribe<T>(messageType: string, handler: MessageHandler<T>): Promise<void>
}
