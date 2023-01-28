import { DosageTable, _DosageTableJSON } from '../dosage-unit/dosage-table/dosage-table.js'
import { PhaseTable, _PhaseTableJSON } from '../phase/phase-table/phase-table.js'

export type _RouteOfAdministrationJSON = {
	bioavailability?: number
	dosage: _DosageTableJSON
	phase: _PhaseTableJSON
}

export class RouteOfAdministration {
	public readonly bioavailability?: number
	public readonly dosage: DosageTable
	public readonly phase: PhaseTable

	constructor(administrationRoute: { bioavailability?: number; dosage: DosageTable; phase: PhaseTable }) {
		this.bioavailability = administrationRoute.bioavailability
		this.dosage = administrationRoute.dosage
		this.phase = administrationRoute.phase
	}

	toJSON(): _RouteOfAdministrationJSON {
		return {
			bioavailability: this.bioavailability,
			dosage: this.dosage.toJSON(),
			phase: this.phase.toJSON()
		}
	}

	static fromJSON(json: _RouteOfAdministrationJSON): RouteOfAdministration {
		return new RouteOfAdministration({
			bioavailability: json.bioavailability,
			dosage: DosageTable.fromJSON(json.dosage),
			phase: PhaseTable.fromJSON(json.phase)
		})
	}
}
