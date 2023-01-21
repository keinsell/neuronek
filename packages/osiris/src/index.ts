import { Osiris } from './osiris.js'
import { getSubstanceFromPsychonautWiki } from './providers/psychonautwiki/get-substance/get-substance.js'

export const osiris = new Osiris()

console.log(await getSubstanceFromPsychonautWiki('LSD'))

export { DosageClassification } from './shared/dosage/dosage-classification.js'
export { RouteOfAdministrationClassification } from './shared/route-of-administration/route-of-administration-classification.js'
