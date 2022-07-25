import flattenReference from '../utils/flattenReference.js'
import Graph from '../graph.js'
import Code from './code.js'
import IfBlock from './if-block.js'
import EachBlock from './each-block.js'
import Element from './element.js'
import Text from './text.js'
import MustacheTag from './mustache-tag.js'
import Comment from './comment.js'
import InlineComponent from './inline-component.js'
import { walk } from 'svelte/compiler'

const BLANK = /^\s+$/
const nodeMap = {
    IfBlock,
    EachBlock,
    Element,
    Text,
    MustacheTag,
    Comment,
    InlineComponent
}

function walkTpl(node, fn) {
    node.children.forEach((node) => {
        // ignore
        if (node.type === 'Text' && BLANK.test(node.raw)) return
        fn(node)
    })
}

function count() {
    const nameMap = {}
    return function (name) {
        if (!nameMap[name]) {
            nameMap[name] = 1
            return name
        } else {
            return `${name}__${nameMap[name]++}`
        }
    }
}

export default class Fragment {
    constructor(component, ast, code) {
        this.ast = ast
        this.code = code
        // define, main
        this.codes = [new Code, new Code]
        this.stack = []
        this.current = this.codes[1]
        this.count = count()
        this.values = ['props']
        this.depCom = []
        this.graph = new Graph

        if (!component.ast.instance) return
        this.values.push('state', 'setState')

        // useReducer has dispatch function
        if (component.jsOptions.reducer) {

        }
    }

    addDepCom(name) {
        if (this.depCom.indexOf(name) < 0) {
            this.depCom.push(name)
        }
    }

    expression(node) {
        const fragment = this
        walk(node, {
            enter(node, parent) {
                if (
                    node.type === 'ObjectExpression' || 
                    node.type === 'Property' ||
                    node.type === 'BinaryExpression' ||
                    node.type === 'Literal'
                ) {
                    // ignore
                } else {
                    const flat = flattenReference(node)
                    if (!flat) console.log(node)
                    flat && fragment.graph.add(flat.keypath)
                    this.skip()
                }
            }
        })

        return {
            string: this.code.slice(node.start, node.end)
        }
    }

    setCurrent(current) {
        if (current instanceof Code) {
            this.stack.push(this.current)
            this.current = current
        } else {
            throw new Error(`${current} is not a Code instance`)
        }
    }

    LastCurrent() {
        this.current = this.stack.pop()
    }

    addCode(code) {
        this.current.addCode(code)
    }

    addLine(line) {
        this.current.addLine(line)
    }

    addBlock(block) {
        this.current.addBlock(block)
    }

    noNeedN() {
        this.current.noNeedN()
    }

    trimEnd(reg) {
        this.current.trimEnd(reg)
    }

    indent(num) {
        this.current.indent += num
    }

    visit(target = this.ast) {
        walkTpl(target, (node) => {
            const nodeGenerator = nodeMap[node.type]
            if (!nodeGenerator) {
                throw new Error(`No ${node.type} Node implementation found`)
            }
            if (typeof nodeGenerator === 'function') {
                nodeGenerator(this, node)
            } else if (nodeGenerator.enter && nodeGenerator.leave) {
                nodeGenerator.enter(this, node)
                this.visit(node)
                nodeGenerator.leave(this, node)
            }
        })
    }

    returnWrapper(node) {
        const isFragement = node.children.length > 1
        isFragement ?
            this.addLine('return <>') :
            this.addLine('return (')
        this.indent(1)
        this.visit(node)
        this.indent(-1)
        isFragement ?
            this.addLine('</>') :
            this.addLine(')')
    }

    generate() {
        this.returnWrapper(this.ast)
        this.graph.build()
    }
}