import 'reflect-metadata'
import { EventEmitterBroker } from './shared/@foundry/messaging/broker.js'
import { UsernameChanged } from './modules/identity-and-access-mangement/domain/events/username-changed/username-changed.js'
import { Account } from './modules/identity-and-access-mangement/domain/entities/account.js'
import { createTopic } from './shared/@foundry/base/topic.js'
import { AccountCreated } from './modules/identity-and-access-mangement/domain/events/account-created/account-created.js'
import { AccountCreatedHandler } from './modules/identity-and-access-mangement/domain/events/account-created/account-created-handler.js'
import { EventEmitterPublisher } from './shared/@foundry/messaging/publisher.js'



export { HttpApplication } from './interfaces/http/http.js'

const messageBroker = new EventEmitterBroker()
const messagePublisher = new EventEmitterPublisher(messageBroker)

const message = new UsernameChanged(undefined as unknown as Account)
const message2 = new AccountCreated(undefined as unknown as Account)

messageBroker.subscribe(createTopic('account-created'), new AccountCreatedHandler())

messagePublisher.publish(message, createTopic('username-changed'))
messagePublisher.publish(message, createTopic('username-changed'))
messagePublisher.publish(message2, createTopic('account-created'))
