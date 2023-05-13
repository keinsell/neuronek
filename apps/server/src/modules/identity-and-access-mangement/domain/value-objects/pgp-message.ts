import * as t from 'io-ts'

const PgpMessage = t.type({
	message: t.string,
	signature: t.string
})

type PgpMessage = t.TypeOf<typeof PgpMessage>

export { PgpMessage }
