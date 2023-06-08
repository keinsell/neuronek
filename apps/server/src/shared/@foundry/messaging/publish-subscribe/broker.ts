import { EventEmitter } from 'events'
import { MessageHandler } from '../message-handler.js'
import { Message } from '../message.js'
import { Topic } from './topic.js'
import { Connection } from '~foundry/base/conncetion.js'


export abstract class Broker<ConnectionType extends Connection<unknown> = Connection<unknown>, MessageType extends Message<unknown> = Message<unknown>> {

  constructor(public readonly connection?: Connection<ConnectionType>) {
  }

  async $connect() {
    return this.connection?.connect()
  }

  async $disconnect() {
    return this.connection?.disconnect()
  }

  abstract publish<T extends MessageType>(message: T, topic: Topic): Promise<void> | void

  abstract subscribe<T extends MessageType>(topic: Topic, handler: MessageHandler<T>): Promise<void>

  abstract unsubscribe<T extends MessageType>(topic: Topic, handler: MessageHandler<T>): Promise<void>
}


export class EventEmitterBroker
  extends Broker {
  private readonly emitter = new EventEmitter()

  publish<T extends Message>(message: T, topic: Topic) {
    this.emitter.emit(topic, message)
  }

  async subscribe<T extends Message>(topic: Topic, handler: MessageHandler<T>): Promise<void> {
    this.emitter.on(topic, async (message: T) => {
      await handler.handle(message)
    })
  }

  async unsubscribe<T extends Message>(topic: Topic, handler: MessageHandler<T>): Promise<void> {
    this.emitter.off(topic, handler.handle)
  }
}
