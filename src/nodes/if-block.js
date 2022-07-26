function createIfBlock(fragment, node) {
    const expression = fragment.expression(node.expression)
    if (node.elseif) {
        fragment.addLine(`} else if (${expression.string}) {`)
    }  else {
        fragment.addLine(`if (${expression.string}) {`)
    }
    fragment.indent(1)
    fragment.returnWrapper(node)
    fragment.indent(-1)
    if (node.else) {
        node.else.children.forEach(child => {
            if (child.type === 'IfBlock') {
                // in else if
                createIfBlock(fragment, child)
            } else {
                // in else
                fragment.addLine(`} else {`)
                fragment.indent(1)
                fragment.returnWrapper(node.else)
                fragment.indent(-1)
                fragment.addLine(`}`)
            }
        })
    } else {
        fragment.addLine('}')
    }
}

export default (fragment, node) => {
    const ifblock = fragment.count(node.else ? 'if_elseblock' : 'ifblock')
    const values = fragment.values
    fragment.setCurrent()
    fragment.addLine(`function ${ifblock}({${values.join(', ')}}) {`)
    fragment.indent(1)
    createIfBlock(fragment, node)
    fragment.indent(-1)
    fragment.addLine(`}`)
    fragment.lastCurrent()
    fragment.addLine(`{ ${ifblock}({${values.join(', ')}}) }`)
}