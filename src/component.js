import Fragment from './nodes/fragment.js'
import { walk } from 'svelte/compiler'
import { generate } from 'astring'
import Code from './nodes/code.js'


export default class Component {
    constructor(code, ast, options) {
        this.code = code
        this.ast = ast
        this.options = options
        this.jsOptions = null
        this.walk_js()
        this.fragment = new Fragment(this, ast.html, code)
    }

    walk_js() {
        const script = this.ast.instance
        if (!script) return
        const jsOptions = {}
        let exportDefault
        walk(script, {
            enter(node, parent) {
                if (node.type === 'ExportDefaultDeclaration') {
                    parent.body.splice(parent.body.indexOf(node), 1)
                    exportDefault = node
                    this.skip()
                }
            }
        })

        walk(exportDefault, {
            enter(node) {
                if (node.type === 'Property') {
                    // console.log(node)
                    switch (node.key.name) {
                        case 'defaultState':
                        case 'initState':
                        case 'reducer':
                            jsOptions[node.key.name] = node.value
                            break
                        case 'register':
                            jsOptions.register = {}
                            if (node.value && node.value.type === 'ObjectExpression') {
                                node.value.properties.forEach(node => {
                                    if (node.type === 'Property') {
                                        jsOptions.register[node.key.name] = node.value
                                    }
                                }) 
                            }
                            break
                    }                    
                    this.skip()
                }
            }
        })

        if (exportDefault) {
            // set options
            this.jsOptions = jsOptions
        }
    }

    generate() {
        this.fragment.generate()
        const code = new Code
        const hasEventBus = this.fragment.hasEventBus

        code.addLine(`import React from 'react'`)
        if (hasEventBus) {
            code.addLine(`import eventBus from 'bioxide/lib/event-bus.js'`)
        }
        // class build
        if (this.jsOptions) {
            const { defaultState, initState, reducer, register } = this.jsOptions
            code.addBlock(`${generate(this.ast.instance.content)}`)
            code.addBlock(this.fragment.codes[0].map(code => code.toString()).join('\n'))
            if (reducer) {
                // TODO: add reducer helper
            }

            code.addLine(`export default class Component extends React.Component {`)
            code.indent++
            code.addLine(`constructor(props) {`)
            code.indent++
            code.addLine(`super(props)`)
            if (defaultState) {
                code.addBlock(`this.state = ${generate(defaultState)}`)
            } else {
                code.addBlock(`this.state = ${this.fragment.graph.build('state')}`)
            }
            code.addLine(`this.props = props`)
            code.addLine(`this.__ = props.__${hasEventBus ? ' || eventBus.create()' : ''}`)
            code.indent--
            code.addLine(`}`)
            code.addLine(`componentDidMount() {`)
            if (initState) {
                code.indent++
                code.addBlock(`(${generate(initState)})(this.props).then(v => {this.setState(v)})`)
                code.indent--
            }
            if (register) {
                code.indent++
                Object.keys(register).forEach(key => {
                    code.addBlock(`this.__.register('${key}', (payload) => { const { state, setState } = this; (${generate(register[key])})(payload, { state, setState: setState.bind(this) })})`)                    
                })
                code.indent--
            }
            code.addLine(`}`)
            if (register) {
                code.addLine('componentWillUnmount() {')
                code.indent++
                code.addLine(`this.__.destroy()`)
                code.indent--
                code.addLine('}')
            }
            code.addLine(`render() {`)
            code.indent++
            code.addLine(`const { state, props, __ } = this`)
            code.addLine(`const setState = this.setState.bind(this)`)
            code.addLine(`const $trigger = __ ? __.trigger : function () { console.warn('you should not use $trigger in thie component.') }`)
            code.addBlock(`${this.fragment.codes[1].toString(1)}`)
            code.indent--
            code.addLine(`}`)
            code.indent--
            code.addLine(`}`)
        } else {
            const stateGraph = this.fragment.graph.build('state')
            if (this.ast.instance && this.ast.instance.content) {
                code.addBlock(`${generate(this.ast.instance.content)}`)
            }
            code.addBlock(this.fragment.codes[0].toString())
            code.addLine('export default (props) => {')
            code.indent++
            if (stateGraph !== '{\n}') {
                code.addBlock(`console.warn(\`component state is undefined, but template use it\`, 'state graph === ', ${stateGraph})`)
            }
            code.addLine(`const __ = props.__${hasEventBus ? ' || eventBus.create()' : ''}`)
            code.addLine(`const $trigger = __ ? __.trigger : function () { console.warn('you should not use $trigger in thie component.') }`)
            code.addBlock(`${this.fragment.codes[1].toString(1)}`)
            code.indent--
            code.addLine('}')
        }        
        
        return code.toString()
    }
}