import { Message } from '../../messaging/message.js'



export abstract class SystemEvent<T = unknown>
  extends Message<T> {
}
