import attributes from "../utils/attributes.js"

export default (fragment, node) => {
    let name = undefined
    if (node.name.indexOf('In:') === 0) {
        name = `In${node.name.slice(3)}`
        fragment.setCurrent(fragment.codes[0])
        if (!fragment.options.resolve) {
            throw new Error(`options.resolve is not defined in complite(code, options)`)
        }
        fragment.addLine(`import ${name} from '${fragment.options.resolve(node.name)}'`)
        fragment.lastCurrent()
    } else {
        // if node.name start with capital letter
        // the node is a component
        name = node.name
        fragment.addDepCom(name)
    }
    if (node.children.length === 0) {
        fragment.addLine(`<${name} `)
        attributes(fragment, node.attributes)
        fragment.addCode(`/>`)
    } else {
        fragment.addLine(`<${name}`)
        if (node.attributes.length > 0) {
            fragment.addCode(' ')
            attributes(fragment, node.attributes)
        }
        fragment.addCode(`>`)
        fragment.indent(1)
        fragment.visit(node)
        fragment.indent(-1)
        fragment.addLine(`</${name}>`)
    }
}