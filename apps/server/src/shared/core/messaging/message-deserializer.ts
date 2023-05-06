import { Message } from './message'

export interface MessageDeserializer {
	deserialize<T>(buffer: Buffer): Promise<Message<T>>
}
