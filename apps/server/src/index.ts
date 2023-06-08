import 'reflect-metadata'
import { EventEmitterBroker } from '~foundry/messaging/publish-subscribe/broker.js'
import { PublishSubscribe } from '~foundry/messaging/publish-subscribe/pubsub.js'
import { Subscriber } from '~foundry/messaging/publish-subscribe/subscriber.js'
import { createTopic } from '~foundry/messaging/publish-subscribe/topic.js'
import { Account } from './modules/identity-and-access-mangement/domain/entities/account.js'
import {
  AccountCreatedHandler,
} from './modules/identity-and-access-mangement/domain/events/account-created/account-created-handler.js'
import {
  AccountCreated,
} from './modules/identity-and-access-mangement/domain/events/account-created/account-created.js'



export { HttpApplication } from './interfaces/http/http.js'

const messageBroker = new EventEmitterBroker()
//const messagePublisher = new EventEmitterPublisher( messageBroker )
const messageSubscriber = new Subscriber(createTopic('account-created'), new AccountCreatedHandler())

const pubSub = new PublishSubscribe(messageBroker)
await pubSub.subscribe(messageSubscriber)
await pubSub.publish(new AccountCreated(undefined as unknown as Account), createTopic('account-created'))
