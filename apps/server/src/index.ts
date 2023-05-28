import 'reflect-metadata'

export { HttpApplication } from './interfaces/http/http.js'

//new Identity(
//	new Account({
//		username: await createUsername('keinsell'),
//		password: await createPasswordHash('asdsasddsad')
//	})
//)
//
//// Send 30 messages by looping
//
//class UserCreatedMessageHandler extends MessageHandler<undefined> {
//	public async handle(message: Message<undefined>): Promise<void> {
//		console.log(message)
//	}
//}
//
//const producer = new MemphisMessageProducer('neuronek', cuid())
//await producer.connect()
//
//const consumer = new MemphisMessageConsumer('neuronek', cuid())
//await consumer.start()
//await consumer.subscribe('user-created', new UserCreatedMessageHandler())
//await consumer.subscribe('user-created', new UserCreatedMessageHandler())
//
//for (let index = 0; index < 1000; index++) {
//	const userCreated = new Message({
//		payload: {
//			username: nanoid(1024)
//		},
//		messageType: 'user-created'
//	})
//	producer.send<undefined>(userCreated as any)
//}
