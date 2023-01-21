import { Osiris } from './osiris.js'
import { getSubstanceFromPsychonautWiki } from './providers/psychonautwiki/get-substance/get-substance.js'

export const osiris = new Osiris()

const request = await getSubstanceFromPsychonautWiki('LSD')

console.log(request.substances[0].summary)

export { DosageClassification } from './shared/dosage/dosage-classification.js'
export { RouteOfAdministrationClassification } from './shared/route-of-administration/route-of-administration-classification.js'
