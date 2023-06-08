import { EventEmitter } from 'events'
import { MessageHandler } from '../message-handler.js'
import { Message } from '../message.js'
import { Topic } from './topic.js'



export abstract class Broker<MessageType extends Message<unknown> = Message<unknown>> {
  abstract publish<T extends MessageType>(message: T, topic: Topic): Promise<void> | void

  abstract subscribe<T extends MessageType>(topic: Topic, handler: MessageHandler<T>): Promise<void>

  abstract unsubscribe<T extends MessageType>(topic: Topic, handler: MessageHandler<T>): Promise<void>
}


export class EventEmitterBroker<MessageType extends Message<unknown> = Message<unknown>>
  extends Broker<MessageType> {
  private readonly emitter = new EventEmitter()

  publish<T extends MessageType>(message: T, topic: Topic) {
    this.emitter.emit(topic, message)
    console.log(`Published message ${message._id} to topic ${topic}`)
  }

  async subscribe<T extends MessageType>(topic: Topic, handler: MessageHandler<T>): Promise<void> {
    this.emitter.on(topic, async (message: Message<unknown>) => {
      await handler.handle(message)
    })
  }
  ś
  async unsubscribe<T extends MessageType>(topic: Topic, handler: MessageHandler<T>): Promise<void> {
    this.emitter.off(topic, handler.handle)
  }
}
