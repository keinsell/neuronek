import { MessageHandler } from "~foundry/messaging/message-handler";
import { Connection } from "./conncetion";
import { Message } from "~foundry/messaging/message";

export abstract class Broker {
  constructor(
    private readonly connection: Connection<unknown>,
  ) { }

  public connect(): Promise<void> | void {
    return this.connection.connect();
  }

  public disconnect(): Promise<void> | void {
    return this.connection.disconnect();
  }

  abstract registerHandler<T extends Message<unknown>>(message: T, handler: MessageHandler<T>): Promise<void> | void;

  abstract unregisterHandler<T extends Message<unknown>>(message: T, handler: MessageHandler<T>): Promise<void> | void;
}
