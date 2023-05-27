import { Message } from 'memphis-dev'
import 'reflect-metadata'
import { Account } from './modules/identity-and-access-mangement/domain/entities/account.js'
import { Identity } from './modules/identity-and-access-mangement/domain/identity.js'
import { createPasswordHash } from './modules/identity-and-access-mangement/domain/value-objects/password-hash.js'
import { createUsername } from './modules/identity-and-access-mangement/domain/value-objects/username/username.js'
import { memphisConnection } from './shared/infrastructure/memphis.js'
import { MemphisMessageProducer } from '~components/message-producer/memphis-message-producer.js'

export { HttpApplication } from './interfaces/http/http.js'

new Identity(
	new Account({
		username: await createUsername('keinsell'),
		password: await createPasswordHash('asdsasddsad')
	})
)

// Send 30 messages by looping

for (let i = 0; i < 30; i++) {
	await new MemphisMessageProducer().send({
		id: '123'
	} as any)
}

const consumer = await memphisConnection.consumer({
	stationName: 'neuronek',
	consumerName: 'sample-consumer',
	consumerGroup: ''
})

consumer.setContext({ key: 'value' })
consumer.on('message', (message: Message, _context: object) => {
	console.log(message.getData().toString())
	message.ack()
	message.getHeaders()
})
