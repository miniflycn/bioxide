import Fragment from './nodes/fragment.js'
import { walk } from 'svelte/compiler'
import { generate } from 'astring'
import Code from './nodes/code.js'

export default class Component {
    constructor(code, ast, name) {
        this.code = code
        this.ast = ast
        this.name = name
        this.options = null
        this.fragment = new Fragment(this, ast.html, code)
        this.walk_js()
    }

    walk_js() {
        const script = this.ast.instance
        if (!script) return
        const options = {}
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
                            options[node.key.name] = node.value
                            break
                    }                    
                    this.skip()
                }
            }
        })

        // set options
        this.options = options
    }

    generate() {
        this.fragment.generate()
        const { defaultState, initState, reducer } = this.options
        const code = new Code
        if (reducer) {
            code.addLine(`import { useReducer } from 'react'`)
        } else {
            code.addLine(`import { useState } from 'react'`)
        }
        code.addBlock(`${generate(this.ast.instance.content)}`)
        code.addBlock(this.fragment.codes[0].toString())
        code.addLine('export default (props) => {')
        code.indent++
        if (defaultState) {
            // useReducer
            if (reducer) {
                code.addBlock(
                    `const [state, dispatch] = useReducer(${generate(reducer)}, ${generate(defaultState)})`
                )
            // useState
            } else {
                code.addBlock(
                    `const [state, setState] = useState(${generate(defaultState)})`
                )
            }
        } else {
            // useReducer
            if (reducer) {
                code.addBlock(
                    `const [state, dispatch] = useReducer(${generate(reducer)}, ${this.fragment.graph.build('state')})`
                )
            // useState
            } else {
                code.addBlock(
                    `const [state, setState] = useState(${this.fragment.graph.build('state')})`
                )
            }
        }

        code.addBlock(`${this.fragment.codes[1].toString(1)}`)
        code.indent--
        code.addLine('}')
        
        console.log(code.toString())
    }
}