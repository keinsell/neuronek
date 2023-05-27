import 'reflect-metadata'
import { Account } from './modules/identity-and-access-mangement/domain/entities/account.js'
import { Identity } from './modules/identity-and-access-mangement/domain/identity.js'
import { createPasswordHash } from './modules/identity-and-access-mangement/domain/value-objects/password-hash.js'
import { createUsername } from './modules/identity-and-access-mangement/domain/value-objects/username/username.js'
import { MemphisMessageConsumer } from '~components/message-consumer/memphis-message-consumer.js'
import { MemphisMessageProducer } from '~components/message-producer/memphis-message-producer.js'
import { MessageHandler } from '~foundry/messaging/message-handler.js'
import { Message } from '~foundry/messaging/message.js'

export { HttpApplication } from './interfaces/http/http.js'

new Identity(
	new Account({
		username: await createUsername('keinsell'),
		password: await createPasswordHash('asdsasddsad')
	})
)

// Send 30 messages by looping

class UserCreatedMessageHandler extends MessageHandler<undefined> {
	public async handle(message: Message<undefined>): Promise<void> {
		console.log('UserCreatedMessageHandler', message)
	}
}

const producer = new MemphisMessageProducer('neuronek', 'sample-producerx')
await producer.connect()

const consumer = new MemphisMessageConsumer('neuronek', 'sample-consumer')
await consumer.start()
await consumer.subscribe('user-created', new UserCreatedMessageHandler())

for (let index = 0; index < 1000; index++) {
	const userCreated = new Message({
		payload: undefined,
		messageType: 'user-created'
	})
	producer.send<undefined>(userCreated as any)
}
