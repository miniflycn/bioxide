import attributes from "../utils/attributes.js"

export default (fragment, node) => {
    // if node.name start with capital letter
    // the node is a component
    fragment.addDepCom(node.name)
    if (node.children.length === 0) {
        fragment.addLine(`<${node.name} `)
        attributes(fragment, node.attributes)
        fragment.addCode(`/>`)
    } else {
        fragment.addLine(`<${node.name}`)
        if (node.attributes.length > 0) {
            fragment.addCode(' ')
            attributes(fragment, node.attributes)
        }
        fragment.addCode(`>`)
        fragment.indent(1)
        fragment.visit(node)
        fragment.indent(-1)
        fragment.addLine(`</${node.name}>`)
    }
}