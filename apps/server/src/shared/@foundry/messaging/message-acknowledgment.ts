import { Message } from "./message";

export abstract class MessageAcknowledgment {
  abstract acknowledge(message: Message<unknown>): Promise<void>;
  abstract reject(message: Message<unknown>): Promise<void>;
}
