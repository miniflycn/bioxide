import complier from './src/index.js'
import { readFileSync } from 'fs'


console.log(complier(readFileSync('./design/if.tpl', 'utf-8'), {}))
console.log(complier(readFileSync('./design/each.tpl', 'utf-8')))
console.log(complier(readFileSync('./design/el.tpl', 'utf-8'), {}))
console.log(complier(readFileSync('./design/initState.tpl', 'utf-8')))
console.log(complier(readFileSync('./design/graph.tpl', 'utf-8')))
console.log(complier(readFileSync('./design/component.tpl', 'utf-8'), { test: false}))
console.log(complier(readFileSync('./design/event.tpl', 'utf-8'), {}))
console.log(complier(readFileSync('./design/child-component.tpl', 'utf-8'), { resolve: (name) => { return `./${name}.js`} }))
console.log(complier(readFileSync('./design/register.tpl', 'utf-8'), { resolve: (name) => { return `./${name}.js`} }))
console.log(complier(readFileSync('./design/a.tpl', 'utf-8'), { resolve: (name) => { return `./${name}.js`} }))