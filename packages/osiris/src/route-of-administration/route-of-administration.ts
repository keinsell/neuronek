import { ValueObject } from '../__core/valueobject.js'
import { DosageTable } from '../dosage/dosage-table/dosage-table.js'
import { PhaseTable } from '../phase/phase-table/phase-table.js'
import { Bioavailability } from './bioavailability.js'
import { RouteOfAdministrationClassification } from './RouteOfAdministrationClassification.js'

export interface RouteOfAdministrationProperties {
	readonly classification: RouteOfAdministrationClassification
	readonly bioavailability?: Bioavailability | undefined
	readonly dosage: DosageTable
	readonly phase: PhaseTable
	readonly belongs_to: {
		substanceName: string
	}
}

export class RouteOfAdministration extends ValueObject<RouteOfAdministrationProperties> {}
