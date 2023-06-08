import { MessageHandler } from '~foundry/messaging/message-handler.js'
import { Message } from '~foundry/messaging/message.js'
import { ClassConstructor } from '~foundry/technical/class-constructor'



export abstract class MessageBus<MESSAGE extends Message<unknown>> {
  abstract send<T extends MESSAGE>(message: T): Promise<void> | void

  abstract subscribe<T extends MESSAGE>(
    message: ClassConstructor<T>, handler: MessageHandler<T>): Promise<void> | void

  abstract unsubscribe<T extends MESSAGE>(message: ClassConstructor<T>, handler: MessageHandler<T>): Promise<void>
}
