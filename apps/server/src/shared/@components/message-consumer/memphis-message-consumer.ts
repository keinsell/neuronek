//import { Consumer, Memphis, Message as MemphisMessage } from 'memphis-dev'
//import { MessageConsumer }                              from '~foundry/messaging/message-consumer.js'
//import { MessageHandler }                               from '~foundry/messaging/message-handler.js'
//import { Message }                                      from '~foundry/messaging/message.js'
//import { memphisConnection }                            from '../../infrastructure/memphis.js'
//
//
//
//export class MemphisMessageConsumer implements MessageConsumer<> {
//	private conncetion: Memphis = memphisConnection
//	private consumer: Consumer
//
//	constructor(
//		private readonly station: string,
//		private readonly consumerName: string,
//		private readonly consumerGroup?: string
//	) {}
//
//	public async start(): Promise<void> {
//		this.consumer = await this.conncetion.consumer({
//			stationName: this.station,
//			consumerName: this.consumerName,
//			consumerGroup: this.consumerGroup
//		})
//	}
//
//	public stop(): Promise<void> {
//		return Promise.resolve()
//	}
//
//	public async subscribe<T>(messageType: string, handler: MessageHandler<T>): Promise<void> {
//		this.consumer.on('message', async (message: MemphisMessage, _context: object) => {
//			const deserializedMessage: Message<unknown> = JSON.parse(message.getData().toString())
//
//			if (deserializedMessage.messageType !== messageType) {
//				return
//			}
//
//			message.ack()
//			message.getHeaders()
//
//			await handler.handle(deserializedMessage as any)
//		})
//	}
//}
