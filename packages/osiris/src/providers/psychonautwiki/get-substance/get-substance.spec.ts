import test from 'ava'
import { getSubstanceFromPsychonautWiki } from './get-substance.js'

test('get substance', async t => {
	const substance = await getSubstanceFromPsychonautWiki('LSD')

	console.log(substance.toJSON())

	t.is(substance.name, 'LSD')
})
