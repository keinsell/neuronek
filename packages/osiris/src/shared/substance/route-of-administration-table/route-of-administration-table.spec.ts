import test from 'ava'
import { RouteOfAdministrationTable } from './route-of-administration-table.js'
import { RouteOfAdministration } from './route-of-administration/route-of-administration.js'
import { RouteOfAdministrationClassification } from './route-of-administration-classification.js'
import { DosageTable } from './route-of-administration/dosage-table/dosage-table.js'
import { PhaseTable } from './route-of-administration/phase-table/phase-table.js'

test('constructor(): should create route of administration table', t => {
	const table = new RouteOfAdministrationTable({})
	t.deepEqual(table, new RouteOfAdministrationTable({}))
})

test('getDocumentedRoutesOfAdministration(): should return only available routes of administration', t => {
	const table = new RouteOfAdministrationTable({
		oral: new RouteOfAdministration({
			dosage: new DosageTable({}),
			phase: new PhaseTable({})
		})
	})

	t.is(table.getDocumentedRoutesOfAdministration().length, 1)
})

test('toJSON(): should return json', t => {
	const table = new RouteOfAdministrationTable({
		oral: new RouteOfAdministration({
			dosage: new DosageTable({}),
			phase: new PhaseTable({})
		}),
		insufflated: new RouteOfAdministration({
			dosage: new DosageTable({}),
			phase: new PhaseTable({})
		})
	})

	t.deepEqual(table.toJSON(), {
		oral: undefined,
		insufflated: undefined
	})
})

test('fromJSON(): should create route of administration table', t => {
	const table = RouteOfAdministrationTable.fromJSON({
		oral: undefined,
		insufflated: undefined
	})

	t.deepEqual(
		table,
		new RouteOfAdministrationTable({
			insufflated: undefined,
			oral: undefined
		})
	)
})
