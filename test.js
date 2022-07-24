import complier from './src/index.js'
import { readFileSync } from 'fs'

complier(readFileSync('./design/if.tpl', 'utf-8'))
// complier(readFileSync('./design/each.tpl', 'utf-8'))
// complier(readFileSync('./design/el.tpl', 'utf-8'))