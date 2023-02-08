import { Dosage, Ingestion, RouteOfAdministrationClassification } from 'osiris'

const caffeineIngestion = Ingestion.create({
	substance_name: 'Caffeine',
	subject_username: 'johndoe',
	routeOfAdministration: RouteOfAdministrationClassification.oral,
	dosage: new Dosage({ amount: 100, unit: 'mg' })
})
