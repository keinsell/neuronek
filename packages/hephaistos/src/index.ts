import { Hephaistos } from './main.js'
import { PsychonautWikiSubstanceProvider } from './substance-provider/psychonautwiki/psychonautwiki.substance-provider.js'

const dataset = await new Hephaistos().build()

console.log(dataset)
console.log(dataset.findSubstanceByName('Speed').routes_of_administration.oral)
