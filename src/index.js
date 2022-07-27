import { parse } from 'svelte/compiler'
import Component from './component.js'

export default (code, options) => {
    const ast = parse(
        code
            .replace(/\@register=\"/g, 'bioxide:r="')
            .replace(/\@trigger:(\w+)=(\"|\{)/g, 'bioxide:t$1=$2')
    )
    const component = new Component(code, ast, options)
    return component.generate()
    // console.log(ast)
}