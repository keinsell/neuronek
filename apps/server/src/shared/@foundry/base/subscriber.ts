import { Message } from "~foundry/messaging/message";
import { MessageHandler } from "~foundry/messaging/message-handler";


export class Subscriber<MessageType extends Message<unknown>> {
  constructor(
    private readonly handler: MessageHandler<MessageType>
  ) { }

  handle<T extends MessageType>(message: T): Promise<void> | void {
    this.handler.handle(message);
  }
}
