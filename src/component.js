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

        // set options
        this.jsOptions = jsOptions
    }

    generate() {
        this.fragment.generate()
        const { test } = this.options
        const code = new Code
        code.addLine(`import React from 'react'`)

        if (this.ast.instance) {
            const { defaultState, initState, reducer } = this.jsOptions
            // 测试处理
            if (test) {
                code.addLine(`import { act } from 'react-dom/test-utils'`)
            }
            if (reducer) {
                code.addLine(`import { useReducer${initState ? ', useLayoutEffect': ''} } from 'react'`)
            } else {
                code.addLine(`import { useState${initState ? ', useLayoutEffect': ''} } from 'react'`)
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

            if (initState) {
                // useReducer
                if (reducer) {
                // TODO

                // useState
                } else {
                    code.addLine(`useLayoutEffect(() => {`)
                    code.indent++
                    test ? 
                        code.addBlock(`act(() => {(${generate(initState)})().then(v => setState(v))})`)
                        : code.addBlock(`;(${generate(initState)})().then(v => {setState(v)})`)
                    code.indent--
                    code.addLine(`}, [])`)
                }
            }

        } else {
            const stateGraph = this.fragment.graph.build('state')
            code.addBlock(this.fragment.codes[0].toString())
            code.addLine('export default (props) => {')
            code.indent++
            if (stateGraph !== '{\n}') {
                code.addBlock(`console.warn(\`component state is undefined, but template use it\`, 'state graph === ', ${stateGraph})`)
            }
        }

        code.addBlock(`${this.fragment.codes[1].toString(1)}`)
        code.indent--
        code.addLine('}')
        
        return code.toString()
    }
}