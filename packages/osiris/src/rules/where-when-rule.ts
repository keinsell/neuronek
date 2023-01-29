import { DosageClassification } from '../dosage/dosage-classification.js'
import { RouteOfAdministrationClassification } from '../route-of-administration/route-of-administration-table/route-of-administration-classification.js'

/**
 * WhenWhereRule is a class that represents a very basic rule than can be applied to substances for algorithmic resolving connected effects, harm-reduction or other algorithmic purposes.
 */
export class WhereWhenRule {
	dosage?: {
		greeterThan?: DosageClassification
		greeterThanOrEquals?: DosageClassification
		lessThan?: DosageClassification
		lessThanOrEquals?: DosageClassification
		equals?: DosageClassification
	}
	route_of_administration?: {
		equals?: RouteOfAdministrationClassification
		in?: RouteOfAdministrationClassification[]
	}
	phase?: {
		greeterThan?: string
		greeterThanOrEquals?: string
		lessThan?: string
		lessThanOrEquals?: string
		equals?: string
		in?: string[]
	}
}
