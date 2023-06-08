import { Message } from '../message.js'
import { Broker } from './broker.js'
import { Subscriber } from './subscriber.js'
import { Topic } from './topic.js'



export class PublishSubscribe {
  constructor(private readonly broker: Broker) {
  }

  async publish<T extends Message<unknown>>(message: T, topic: Topic): Promise<void> {
    return this.broker.publish(message, topic)
  }

  async subscribe(subscriber: Subscriber<Message<unknown>>): Promise<void> {
    return this.broker.subscribe(subscriber.topic, subscriber)
  }
}
