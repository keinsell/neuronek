import test, { TestFn } from 'ava'
import { Substance } from './substance.js'
import { RouteOfAdministrationTable } from './route-of-administration-table/route-of-administration-table.js'

test('constructor(): should create substance', t => {
	const substance = new Substance({
		name: 'LSD',
		routes_of_administration: new RouteOfAdministrationTable({})
	})

	t.deepEqual(
		substance,
		new Substance({
			name: 'LSD',
			routes_of_administration: new RouteOfAdministrationTable({})
		})
	)
})

test('toJSON(): should return json', t => {
	const substance = new Substance({
		name: 'LSD',
		routes_of_administration: new RouteOfAdministrationTable({})
	})

	t.is(substance.toJSON().name, 'LSD')
})
