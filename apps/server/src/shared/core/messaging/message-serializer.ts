import { Message } from './message'

export interface MessageSerializer {
	serialize<T>(message: Message<T>): Promise<Buffer>
}
