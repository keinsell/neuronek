import { memphisConnection } from '../../infrastructure/memphis.js'
import { kebabSpace } from '../../utils/kebab-space.js'
import { Memphis, memphis } from 'memphis-dev'
import { MessageProducer } from '~foundry/messaging/message-producer.js'
import { Message } from '~foundry/messaging/message.js'

export class MemphisMessageProducer extends MessageProducer {
	private conncetion: Memphis = memphisConnection

	public async connect(): Promise<void> {}

	public async disconnect(): Promise<void> {
		return Promise.resolve(undefined)
	}

	public async send<T>(message: Message<T>): Promise<void> {
		const producer = await this.conncetion.producer({
			stationName: 'neuronek',
			producerName: kebabSpace(this.constructor.name)
		})

		await producer.produce({
			message: Buffer.from(JSON.stringify(message)), // you can also send JS object - {}
			headers: memphis.headers()
		})
	}
}
