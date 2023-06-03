// eslint-disable-next-line node/no-unpublished-import

import { Memphis, memphis, Producer } from 'memphis-dev'
import { MessageProducer }            from '~foundry/messaging/message-producer.js'
import { Message }                    from '~foundry/messaging/message.js'
import { memphisConnection }          from '../../infrastructure/memphis.js'



export class MemphisMessageProducer implements MessageProducer {
	private conncetion: Memphis = memphisConnection
	private producer: Producer

	constructor(private readonly station: string, private readonly producerName: string) {}

	public async connect(): Promise<void> {
		this.producer = await this.conncetion.producer({
			stationName: this.station,
			producerName: this.producerName
		})
	}

	public async disconnect(): Promise<void> {
		await this.producer.destroy()
	}

	public async send<T extends Message<any>>(message: new (...arguments_: any[]) => T): Promise<void> {
		await this.producer.produce({
			message: Buffer.from(JSON.stringify(message)),
			headers: memphis.headers()
		})
	}
}
