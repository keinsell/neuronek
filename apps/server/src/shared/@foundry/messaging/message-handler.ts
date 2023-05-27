import { Message } from './message'

/**
 * A message handler function is responsible for processing the message payload, updating application state, and sending additional messages to the message queue.
 *
 * ```
 * import { MessageHandler } from './message';
 *
 * const handleOrderPlaced: MessageHandler<OrderPlacedMessage> = async (message) => {
 *   const { customerName, items, shippingAddress } = message.payload;
 *
 *   // Do some processing with the message data...
 *
 *   // Send a confirmation message to the customer
 *   const confirmationMessage = {
 *     id: uuidv4(),
 *     messageType: 'OrderConfirmation',
 *     payload: { orderId: message.id },
 *   };
 *   await producer.sendMessage(confirmationMessage);
 * };
 * ```
 */
export interface MessageHandler<T> {
	(message: Message<T>): Promise<void>
}
