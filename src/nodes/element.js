const attributeMap = {
    'class': 'className'
}

function attributes(fragment, attributes) {
    attributes.forEach(attribute => {
        // TODO: cannot create graph for spread objects
        if (attribute.type === 'Spread') {
            const expression = fragment.expression(attribute.expression)
            fragment.addCode(`{...${expression.string}}`)
            return
        }

        if (attributeMap[attribute.name]) {
            fragment.addCode(`${attributeMap[attribute.name]}=`)
        } else {
            fragment.addCode(`${attribute.name}=`)
        }
        if (attribute.type === 'Attribute') {
            const typeFlag = attribute.value.length > 1 ?
                'template' : attribute.value[0].type === 'Text' ?
                'template' : 'mustacheTag'

            typeFlag === 'template' ? 
                fragment.addCode('`') : fragment.addCode('{')
            const values = []
            attribute.value.forEach(v => {
                if (v.type === 'Text') {
                    values.push(`${v.data}`)
                } else if (v.type === 'MustacheTag') {
                    const expression = fragment.expression(v.expression)
                    typeFlag === 'template' ?
                        values.push(`\$\{${expression.string}\}`) :
                        values.push(expression.string)
                } else {
                    throw new Error(`${v.type} is not supported`)
                }
            })
            fragment.addCode(values.join(''))
            typeFlag === 'template' ? 
                fragment.addCode('`') : fragment.addCode('}')
        } else {
            throw new Error(`${attribute.type} is not supported`)
        }
    })
}

export default (fragment, node) => {
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