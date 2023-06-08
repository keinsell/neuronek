import { Connection } from "~foundry/base/conncetion";

export abstract class MessageQueue {
  constructor(
    public connection: Connection<unknown>,
  ) { }
}
