import test from 'ava'
import { getSubstanceFromPsychonautWiki } from './get-substance.js'

test('get substance', async t => {
	const substance = await getSubstanceFromPsychonautWiki('LSD')

	t.is(substance.name, 'LSD')
})
