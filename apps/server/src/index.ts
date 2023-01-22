import osiris, { _SubstanceJSON } from 'osiris'

export interface SubstanceResponse extends _SubstanceJSON {}

const amphetamine = await osiris.findSubstanceByName('Amphetamine')

console.log(amphetamine)
console.log(amphetamine.routes_of_administration.getDocumentedRoutesOfAdministration())
