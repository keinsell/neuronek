import * as t from 'io-ts'

/** Username defines the shape and constraints of a username value object. */
export const Username = t.brand(
	t.string,
	(username): username is t.Branded<string, { readonly Username: unique symbol }> =>
		username.length >= 4 && username.length <= 32,
	'Username'
)

export type Username = t.TypeOf<typeof Username>
