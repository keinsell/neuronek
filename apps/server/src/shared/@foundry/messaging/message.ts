import { kebabSpace } from '../../utils/kebab-space.js'
import { Topic, createTopic } from '../base/topic.js'
import { nanoid } from '../indexing/nanoid/index.js'
import { UniqueId } from '../indexing/unique-id.js'


export enum MessageType {
  EVENT = 'EVENT',
  COMMAND = 'COMMAND',
  DOCUMENT = 'DOCUMENT',
  REQUEST = 'REQUEST',
  REPLY = 'REPLY',
}

/**
 * The Message interface defines a common structure for messages that are exchanged between different services in a
 * message-based architecture.
 */
interface MessageProperties {
  readonly _id: string
  readonly _causationId?: UniqueId
  readonly _correlationId?: UniqueId
  readonly _timestamp: Date
  readonly _type: MessageType
  readonly _topic: Topic
  headers?: Record<string, string>
  metadata?: Record<string, any>
}


export type MessagePayload<T> = Omit<MessageProperties, '_id' | '_type' | '_timestamp' | '_topic'> & T


export class Message<T>
  implements MessageProperties {
  public readonly _id: string = nanoid()
  public readonly _causationId: UniqueId
  public readonly _correlationId: UniqueId
  public readonly _topic: Topic = createTopic(kebabSpace(this.constructor.name))
  public readonly _type: MessageType = MessageType.DOCUMENT
  public readonly _timestamp: Date = new Date()
  public readonly _headers: Record<string, string>
  public readonly _metadata: Record<string, any>

  constructor(message?: MessagePayload<T>) {
    Object.assign(this, message)
  }

  static get type(): string {
    return kebabSpace(this.name)
  }
}
