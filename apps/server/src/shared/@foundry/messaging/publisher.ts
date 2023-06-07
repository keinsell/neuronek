import { Topic } from "../base/topic";
import { Broker, EventEmitterBroker } from "./broker";
import { Message } from "./message";

export class Publisher<MessageType extends Message<unknown>> {
  constructor(
    public readonly broker: Broker<MessageType>
  ) { }

  async publish<T extends MessageType>(message: T, topic?: Topic): Promise<void> {
    return this.broker.publish(message, topic);
  }
}

export class EventEmitterPublisher extends Publisher<Message<unknown>>{
  constructor(emitter: EventEmitterBroker) {
    super(emitter)
  }
}
