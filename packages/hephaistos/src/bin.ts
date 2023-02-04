import figlet from 'figlet'

import { Hephaistos } from './main.js'

figlet('Hephaistos', function (err, data) {
	if (err) return console.log(err)
	console.log(data)
})

console.log('Initializing...')

const hephaistos = await Hephaistos.build()
console.log(hephaistos)
