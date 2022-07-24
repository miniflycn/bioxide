import { parse } from 'svelte/compiler'
import Component from './component.js'

export default (code, options) => {
    const ast = parse(code)
    const component = new Component(code, ast, {})
    component.generate()
    // console.log(ast)
}