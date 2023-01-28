import ava, { TestFn } from 'ava'
import { Substance, _SubstanceJSON } from './substance.js'
import { RouteOfAdministrationTable } from '../route-of-administration/route-of-administration-table/route-of-administration-table.js'

const test = ava as unknown as TestFn<{ substance: Substance; json: _SubstanceJSON }>

test.beforeEach(t => {
	t.context.substance = new Substance({
		name: 'LSD',
		chemical_nomeclature: {},
		class_membership: {},
		routes_of_administration: new RouteOfAdministrationTable({})
	})

	t.context.json = {
		name: 'LSD'
	}
})

test('constructor(): should create substance', t => {
	t.deepEqual(
		t.context.substance,
		new Substance({
			name: 'LSD',
			chemical_nomeclature: {},
			class_membership: {},
			routes_of_administration: new RouteOfAdministrationTable({})
		})
	)
})

test('toJSON(): should return json', t => {
	t.is(t.context.substance.toJSON().name, t.context.json.name)
})
