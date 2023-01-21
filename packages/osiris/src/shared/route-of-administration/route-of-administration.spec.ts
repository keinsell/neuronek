import test from 'ava'
import { RouteOfAdministration } from './route-of-administration.js'
import { RouteOfAdministrationClassification } from './route-of-administration-classification.js'
import { DosageTable } from '../dosage/dosage-table/dosage-table.js'
import { PhaseTable } from '../phase/phase-table/phase-table.js'

test('constructor(): should create route of administration', t => {
	const routeOfAdministration = new RouteOfAdministration({
		dosage: new DosageTable({}),
		phase: new PhaseTable({})
	})
	t.deepEqual(routeOfAdministration.dosage, new DosageTable({}))
	t.deepEqual(routeOfAdministration.phase, new PhaseTable({}))
})
