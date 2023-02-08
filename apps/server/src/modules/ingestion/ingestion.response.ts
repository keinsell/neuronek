import { RouteOfAdministrationClassification } from 'osiris'

export interface IngestionResponse {
	substance: string
	routeOfAdministration: RouteOfAdministrationClassification
	dosage_unit: string
	dosage_amount: number
}
