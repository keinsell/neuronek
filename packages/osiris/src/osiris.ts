import { Substance } from './shared/substance/substance.js'

export class Osiris {
	findSubstancesByEffect(effectName: string): Promise<Substance[]> {}
	findSubstancesByPsychoactiveClass(psychoactiveClassName: string): Promise<Substance[]> {}
	findSubstancesByChemicalClass(chemicalClassName: string): Promise<Substance[]> {}
	findSubstancesBylName(chemicalName: string): Promise<Substance[]> {}
	findSubstancesByRouteOfAdministrationClassification(roa: string): Promise<Substance[]> {}
}
