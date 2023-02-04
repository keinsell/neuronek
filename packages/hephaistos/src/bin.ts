import figlet from 'figlet'

import { PsychonautWikiSubstanceProvider } from './substance-provider/psychonautwiki/psychonautwiki.substance-provider.js'

figlet('Hephaistos', function (err, data) {
	if (err) return console.log(err)
	console.log(data)
})

console.log(await new PsychonautWikiSubstanceProvider().load())
