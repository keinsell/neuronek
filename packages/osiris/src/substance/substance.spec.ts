import ava, { TestFn } from 'ava'
import { Substance } from './substance.js'
import { RouteOfAdministrationTable } from '../route-of-administration/route-of-administration-table/route-of-administration-table.js'

const test = ava as unknown as TestFn<{ substance: Substance }>

test.beforeEach(t => {
	t.context.substance = new Substance({
		name: 'LSD',
		chemical_nomeclature: {},
		class_membership: {},
		routes_of_administration: new RouteOfAdministrationTable({})
	})
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
