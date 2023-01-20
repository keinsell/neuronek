import { DosageTable } from '../dosage/dosage-table/dosage-table.js'
import { PhaseTable } from '../phase/phase-table/phase-table.js'
import { RouteOfAdministrationClassification } from './route-of-administration-classification.js'

export class RouteOfAdministration {
	public readonly classification: RouteOfAdministrationClassification
	public readonly bioavailability?: number
	public readonly dosage: DosageTable
	public readonly phase: PhaseTable

	constructor(administrationRoute: {
		classification: RouteOfAdministrationClassification
		bioavailability?: number
		dosage: DosageTable
		phase: PhaseTable
	}) {
		this.classification = administrationRoute.classification
		this.bioavailability = administrationRoute.bioavailability
		this.dosage = administrationRoute.dosage
		this.phase = administrationRoute.phase
	}
}
