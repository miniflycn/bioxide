const attributeMap = {
    'class': 'className'
}

export default function attributes(fragment, attributes) {
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
                'mustacheTag' : attribute.value[0].type === 'Text' ?
                'template' : 'mustacheTag'

            typeFlag === 'template' ? 
                fragment.addCode('"') : fragment.addCode('{')
            const values = []
            attribute.value.forEach(v => {
                if (v.type === 'Text') {
                    typeFlag === 'template' ? 
                        values.push(`${v.data}`) :
                        values.push(`"${v.data}"`)
                } else if (v.type === 'MustacheTag') {
                    const expression = fragment.expression(v.expression)
                    values.push(`${expression.string}`)
                } else {
                    throw new Error(`${v.type} is not supported`)
                }
            })
            attribute.value.length > 1 ?
                fragment.addCode(`[${values.join(', ')}].join('')`) :
                fragment.addCode(`${values[0]}`)
            typeFlag === 'template' ? 
                fragment.addCode('"') : fragment.addCode('}')
        } else {
            throw new Error(`${attribute.type} is not supported`)
        }
    })
}