import figlet from 'figlet'

import { Hephaistos } from './main.js'

figlet('Hephaistos', function (err, data) {
	if (err) return console.log(err)
	console.log(data)
})

const dataset = await new Hephaistos().build()
