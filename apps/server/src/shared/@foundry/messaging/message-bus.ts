import { ClassConstructor } from '../technical/class-constructor.js'
import { MessageHandler } from './message-handler.js';
import { Message } from './message.js';



export abstract class MessageBus<MESSAGE extends Message<unknown>> {
  abstract send<T extends MESSAGE>(message: T): Promise<void> | void

  abstract subscribe<T extends MESSAGE>(
    message: ClassConstructor<T>, handler: MessageHandler<T>): Promise<void> | void

  abstract unsubscribe<T extends MESSAGE>(message: ClassConstructor<T>, handler: MessageHandler<T>): Promise<void>
}
