import { MessageHandler } from './message-handler'

/**
 * ```
 * import { Connection, Channel, connect, Message as AMQPMessage } from 'amqplib';
 * import { MessageConsumer, MessageHandler } from './message';
 *
 * class RabbitMQConsumer implements MessageConsumer {
 *   private connection: Connection;
 *   private channel: Channel;
 *
 *   constructor(private readonly url: string, private readonly exchange: string) {}
 *
 *   async start(): Promise<void> {
 *     this.connection = await connect(this.url);
 *     this.channel = await this.connection.createChannel();
 *     await this.channel.assertExchange(this.exchange, 'topic', { durable: false });
 *   }
 *
 *   async stop(): Promise<void> {
 *     await this.channel.close();
 *     await this.connection.close();
 *   }
 *
 *   async subscribe<T>(messageType: string, handler: MessageHandler<T>): Promise<void> {
 *     const queue = await this.channel.assertQueue('', { exclusive: true });
 *     await this.channel.bindQueue(queue.queue, this.exchange, messageType);
 *
 *     this.channel.consume(queue.queue, async (message: AMQPMessage | null) => {
 *       if (message) {
 *         try {
 *           const payload = JSON.parse(message.content.toString());
 *           const headers = message.properties.headers ?? {};
 *           const metadata = message.properties.headers ?? {};
 *
 *           await handler({
 *             id: message.properties.messageId,
 *             correlationId: message.properties.correlationId,
 *             messageType,
 *             payload,
 *             headers,
 *             metadata,
 *           });
 *
 *           this.channel.ack(message);
 *         } catch (err) {
 *           this.channel.nack(message, false, false);
 *         }
 *       }
 *     });
 *   }
 * }
 * ```
 */
export interface MessageConsumer {
	start(): Promise<void>

	stop(): Promise<void>

	subscribe<T>(messageType: string, handler: MessageHandler<T>): Promise<void>
}
