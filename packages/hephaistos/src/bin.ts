import figlet from 'figlet'
import { effectindex } from './effectindex.js'
import { psychonautwiki } from './psychonautwiki.js'
import { drugbank } from './drugbank.js'

console.log(figlet.textSync('Hephaistos'))
console.log('Hephaistos is initializing...')

await effectindex()
await psychonautwiki()
await drugbank()
