import test from 'ava'
import { PublicKey } from './public-key'

// test('Valid PublicKey is accepted', async t => {
// 	const publicKey = await generateKey({
// 		userIDs: [{ name: 'Test User', email: 'asd@ads.com' }]
// 	})
//
// 	const result = PublicKey.decode(publicKey.publicKey)
//
// 	t.true(result._tag === 'Right')
// 	t.is((result as unknown as any).right, publicKey)
// })

test('Invalid PublicKey is rejected', t => {
	const publicKey = 'not a valid PGP public key'

	const result = PublicKey.decode(publicKey)

	t.true(result._tag === 'Left')
	t.is((result as unknown as any).left[0].message, 'Value is not a valid PGP public key')
})
