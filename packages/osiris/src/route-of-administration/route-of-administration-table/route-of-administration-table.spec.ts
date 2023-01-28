import test from 'ava'
import { RouteOfAdministrationTable } from './route-of-administration-table.js'
import { RouteOfAdministration } from '../route-of-administration.js'
import { DosageTable } from '../../dosage-unit/dosage-table/dosage-table.js'
import { PhaseTable } from '../../phase/phase-table/phase-table.js'

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

	// TODO: Checked manually by @keinsell, still need automated testing
	t.pass()
})

test('fromJSON(): should create route of administration table', t => {
	const table = RouteOfAdministrationTable.fromJSON({
		insufflated: undefined
	})

	// TODO: Checked manually by @keinsell, still need automated testing
	t.pass()
})
