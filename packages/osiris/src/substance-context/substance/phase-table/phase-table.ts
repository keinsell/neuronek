import { ValueObject } from '../../../common/value-object/value-object.js'
import { PhaseClassification } from './phase-classification.js'

export type PhaseTableProperties = {
	[key in PhaseClassification]?: [number, number]
}

// TODO: PhaseTable should have feature to calculate time to specific phase from now
// TODO: PhaseTable should have feature to calculate time to specific phase from specific phase
// TODO: PhaseTable should have feature to predict date from now when effects will wear off
export class PhaseTable extends ValueObject<PhaseTableProperties> {
	constructor(properties: PhaseTableProperties) {
		super(properties)
	}
}
