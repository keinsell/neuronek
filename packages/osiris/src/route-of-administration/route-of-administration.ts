import { DosageTable } from '../dosage/dosage-table/dosage-table.js'
import { PhaseTable, _PhaseTableJSON } from '../phase/phase-table/phase-table.js'

export class RouteOfAdministration {
	public readonly bioavailability?: number
	public readonly dosage: DosageTable
	public readonly phase: PhaseTable

	constructor(administrationRoute: { bioavailability?: number; dosage: DosageTable; phase: PhaseTable }) {
		this.bioavailability = administrationRoute.bioavailability
		this.dosage = administrationRoute.dosage
		this.phase = administrationRoute.phase
	}
}
