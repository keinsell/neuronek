import { ValueObject } from '../../../common/value-object/value-object.js'

export interface ExternalReferencesProperties {
	psychonautwiki?: string
	tripsit?: string
	isomerdesign?: string
	bluelight?: string
	hyperreal?: string
	reddit?: string
	drugbank?: string
	wikipedia?: string
	erowid?: string
}

export class ExternalReferences extends ValueObject<ExternalReferencesProperties> {
	constructor(properties: ExternalReferencesProperties) {
		super(properties)
	}
}
