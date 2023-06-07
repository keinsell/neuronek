
import { Message } from "~foundry/messaging/message";
import { MessageHandler } from "~foundry/messaging/message-handler";
import { MessageBus } from "~foundry/messaging/messaging-channels/message-bus";
import { ClassConstructor } from "~foundry/technical/class-constructor";

export class MemphisMessageBus extends MessageBus<Message<unknown>> {
  override send<T extends Message<unknown>>(message: T): void | Promise<void> {
    throw new Error("Method not implemented.");
  }

  override subscribe<T extends Message<unknown>>(message: ClassConstructor<T>, handler: MessageHandler<T>): void | Promise<void> {
    throw new Error("Method not implemented.");
  }

  override unsubscribe<T extends Message<unknown>>(message: ClassConstructor<T>, handler: MessageHandler<T>): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
