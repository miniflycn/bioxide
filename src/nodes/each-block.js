export default (fragment, node) => {
    const expression = fragment.expression(node.expression)
    const values = fragment.values
    const eachblock = fragment.count('eachblock')
    fragment.setCurrent(fragment.codes[0])
    fragment.addLine(`function ${eachblock}(${values.join(', ')}) {`)
    fragment.indent(1)
    const context = node.context.name
    const index = node.index
    if (index) {
        fragment.addLine(`return ${expression.string}.map((${context}, ${index}) => {`)
        fragment.values.push(context, index)
    } else {
        fragment.addLine(`return ${expression.string}.map((${context}) => {`)
        fragment.values.push(context)
    }
    fragment.indent(1)
    fragment.returnWrapper(node)
    fragment.indent(-1)
    if (index) {
        fragment.values.pop()
        fragment.values.pop()
    } else {
        fragment.values.pop()
    }
    fragment.addLine(`})`)
    fragment.indent(-1)
    fragment.addLine(`}`)
    fragment.LastCurrent()
    fragment.addLine(`{ ${eachblock}(${values.join(', ')}) }`)
}