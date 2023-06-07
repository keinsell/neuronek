import { Message } from "./message";
import { MessageHandler } from "./message-handler";

export class Subscriber<MessageTypes extends Message<unknown>> {
  constructor(private readonly handler: MessageHandler<MessageTypes>) {
  }

  handle<T extends MessageTypes>(message: T) {
    this.handler.handle(message);
  }
}
