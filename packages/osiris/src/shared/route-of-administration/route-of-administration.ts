import { DosageTable } from '../dosage/dosage-table/dosage-table.js'
import { PhaseTable } from '../phase/phase-table/phase-table.js'
import { RouteOfAdministrationClassification } from './route-of-administration-classification.js'

export class RouteOfAdministration {
	classification: RouteOfAdministrationClassification
	bioavailability?: number
	dosage: DosageTable
	phase: PhaseTable
}
