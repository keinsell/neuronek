import { DosageTable } from './dosage-table/dosage-table.js'
import { PhaseTable } from './phase-table/phase-table.js'
import { Bioavailability } from './bioavailability/bioavailability.js'
import { RouteOfAdministrationClassification } from '../context.substance/route-of-administration-table/RouteOfAdministrationClassification.js'

export interface RouteOfAdministrationProperties {
	readonly classification: RouteOfAdministrationClassification
	readonly bioavailability?: Bioavailability | undefined
	readonly dosage: DosageTable
	readonly phase: PhaseTable
	readonly belongs_to: {
		substanceName: string
	}
}

export class RouteOfAdministration {
	readonly classification: RouteOfAdministrationClassification
	readonly bioavailability?: Bioavailability | undefined
	readonly dosage: DosageTable
	readonly phase: PhaseTable
	readonly belongs_to: {
		substanceName: string
	}

	private constructor(properties: RouteOfAdministrationProperties) {
		Object.assign(this, properties)
	}

	static create(properties: {
		classification: RouteOfAdministrationClassification
		dosage: DosageTable
		phase: PhaseTable
		belongs_to: { substanceName: string }
	}): RouteOfAdministration {
		return new RouteOfAdministration({
			...properties
		})
	}
}
