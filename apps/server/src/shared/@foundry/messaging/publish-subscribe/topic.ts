import * as t from 'io-ts'
import { InvalidValue } from '~foundry/exceptions/invalid-value.js'


interface TopicBrand {
  readonly Topic: unique symbol
}

const TopicCodec = t.brand(t.string, (s: string): s is t.Branded<string, TopicBrand> => !!s, 'Topic')

export type Topic = t.TypeOf<typeof TopicCodec>

export function createTopic(topic: string): Topic {
  const validationResult = TopicCodec.decode(topic)
  if (validationResult._tag === 'Left') {
    throw new InvalidValue('Invalid Topic')
  } else {
    return validationResult.right
  }
}
