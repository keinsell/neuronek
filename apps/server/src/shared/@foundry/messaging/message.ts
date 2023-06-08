import { kebabSpace } from '../../utils/kebab-space.js'
import { nanoid } from '../indexing/nanoid/index.js'
import { UniqueId } from '../indexing/unique-id.js'
import { createTopic, Topic } from './publish-subscribe/topic.js'



export enum MessageType {
  EVENT = 'EVENT', COMMAND = 'COMMAND', DOCUMENT = 'DOCUMENT', REQUEST = 'REQUEST', REPLY = 'REPLY',
}


/**
 * The Message interface defines a common structure for messages that are exchanged between different services in a
 * message-based architecture.
 */
interface MessageProperties {
  readonly _id: string
  readonly _causationId?: UniqueId | undefined
  readonly _correlationId?: UniqueId | undefined
  readonly _timestamp: Date
  readonly _type: MessageType
  readonly _topic: Topic
  readonly _headers?: Record<string, string> | undefined
  readonly _metadata?: Record<string, any> | undefined
}


export type MessagePayload<T> = Omit<MessageProperties, '_id' | '_type' | '_timestamp' | '_topic'> & T


export class Message<T = unknown>
  implements MessageProperties {
  public readonly _id: string = nanoid()
  public readonly _causationId?: UniqueId | undefined
  public readonly _correlationId?: UniqueId | undefined
  public readonly _topic: Topic = createTopic(kebabSpace(this.constructor.name))
  public readonly _type: MessageType = MessageType.DOCUMENT
  public readonly _timestamp: Date = new Date()
  public readonly _headers?: Record<string, string> | undefined
  public readonly _metadata?: Record<string, any> | undefined

  constructor(message?: MessagePayload<T>) {
    Object.assign(this, message)
    this._causationId = message?._causationId
    this._correlationId = message?._correlationId
    this._headers = message?._headers
    this._metadata = message?._metadata
  }

  static get type(): string {
    return kebabSpace(this.name)
  }
}
