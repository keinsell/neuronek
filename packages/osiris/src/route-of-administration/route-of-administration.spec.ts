import test from 'ava'
import { RouteOfAdministration, _RouteOfAdministrationJSON } from './route-of-administration.js'
import { DosageTable } from '../dosage-unit/dosage-table/dosage-table.js'
import { PhaseTable } from '../phase/phase-table/phase-table.js'
import { DosageUnit } from '../dosage-unit/dosage-unit.js'

test('constructor(): should create route of administration', t => {
	const routeOfAdministration = new RouteOfAdministration({
		dosage: new DosageTable({}),
		phase: new PhaseTable({})
	})
	t.deepEqual(routeOfAdministration.dosage, new DosageTable({}))
	t.deepEqual(routeOfAdministration.phase, new PhaseTable({}))
})

test('toJSON(): should return json', t => {
	const routeOfAdministration = new RouteOfAdministration({
		dosage: new DosageTable({}),
		phase: new PhaseTable({})
	})

	t.deepEqual(routeOfAdministration.toJSON(), {
		bioavailability: undefined,
		dosage: {
			thereshold: undefined,
			light: undefined,
			moderate: undefined,
			strong: undefined,
			heavy: undefined
		},
		phase: { onset: undefined, comeup: undefined, peak: undefined, offset: undefined, aftereffects: undefined }
	} as _RouteOfAdministrationJSON)
})

test('fromJSON(): should return route of administration', t => {
	const routeOfAdministration = new RouteOfAdministration({
		dosage: new DosageTable({
			moderate: DosageUnit.fromString('10mg')
		}),
		phase: new PhaseTable({})
	})

	t.is(
		RouteOfAdministration.fromJSON(routeOfAdministration.toJSON()).dosage.moderate.toString(),
		routeOfAdministration.toJSON().dosage.moderate
	)
})
