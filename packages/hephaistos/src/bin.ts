import figlet from 'figlet'

import { Hephaistos } from './main.js'

console.log(figlet.textSync('Hephaistos'))
console.log('Hephaistos is initializing...')

const hephaistos = await Hephaistos.build()
console.log(hephaistos)
