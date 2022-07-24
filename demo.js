import complier from './src/index.js'
import { readFileSync } from 'fs'

// console.log(readFileSync('./design/if.tpl', 'utf-8')))
// console.log(complier(readFileSync('./design/each.tpl', 'utf-8')))
console.log(complier(readFileSync('./design/el.tpl', 'utf-8')))