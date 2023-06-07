import { Topic } from "~foundry/base/topic";
import { Message } from "~foundry/messaging/message";

export class Producer {
  constructor(private readonly channel: any) { }

  async produce(message: Message<unknown>, topic: Topic): Promise<void> {
    await this.channel.dispatch(message, topic);
  }
}
