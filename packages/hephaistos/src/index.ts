import { Hephaistos } from './main.js'

const dataset = await new Hephaistos().build()

console.log(dataset)
console.log(dataset.findSubstanceByName('LSD'))
