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

        // class build
        if (this.jsOptions) {
            const { defaultState, initState, reducer } = this.jsOptions
            code.addLine(`import React from 'react'`)
            code.addBlock(`${generate(this.ast.instance.content)}`)
            code.addBlock(this.fragment.codes[0].toString())
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
            code.indent--
            code.addLine(`}`)
            if (initState) {
                code.addLine(`componentWillMount() {`)
                code.indent++
                code.addBlock(`;(${generate(initState)})().then(v => {this.setState(v)})`)
                code.indent--
                code.addLine(`}`)
            }
            code.addLine(`render() {`)
            code.indent++
            code.addLine(`const { state, props } = this`)
            code.addLine(`const setState = this.setState.bind(this)`)
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
            code.addBlock(`${this.fragment.codes[1].toString(1)}`)
            code.indent--
            code.addLine('}')
        }        
        
        return code.toString()
    }
}