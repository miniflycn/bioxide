export default (fragment, node) => {
    const expression = fragment.expression(node.expression)
    fragment.addCode(`{ ${expression.string} }`)
    fragment.noNeedN()
}